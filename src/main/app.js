const { app, BrowserWindow, dialog, ipcMain, globalShortcut, Menu, clipboard } = require('electron')
const path = require('path')
const fsPromise = require('fs/promises')
const { netLog } = require('electron')
const screenshot = require('screenshot-desktop');

// const openHelp = require('./lib/openHelp.js')();

const EduNuageExam = {
  willOpenDialog: false,
  gotBlurred: false,
  events: []
}

app.whenReady().then(() => {


  EduNuageExam.mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    useContentSize: true,
    icon: path.join(__dirname, '../../resources/logo.png')
  })

  const menu = Menu.buildFromTemplate(
    [
      {
        label: 'EduNuageExam',
        submenu: [{
          label: "Quitter le logiciel",
          click: () => {
            EduNuageExam.mainWindow.close();
          }
        }]
      },
      {
        label: 'Navigateur',
        submenu: [
          {
            label: "Recharger la page", /* en vidant le cache */
            role: 'forceReload' /* 'reload' */
          },
          {
            label: "Précédent",
            click: () => {
              EduNuageExam.mainWindow.webContents.goBack();
            }
          }
        ]
      }
    ]);

  EduNuageExam.mainWindow.setMenu(menu);

  EduNuageExam.mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    dialog.showMessageBox(EduNuageExam.mainWindow, {
      type: 'question',
      buttons: ['Ouvrir l\'url', 'Rester sur la page'],
      title: 'Le site essaye d\'ouvrir une nouvelle page',
      message: 'Le site essaye d\'ouvrir une nouvelle page. Voulez-vous l\'ouvrir ?',
      cancelId: 1,
      defaultId: 0,
    }).then((result) => {
      if (result.response === 0) { // Ouvrir l'url
        EduNuageExam.mainWindow.loadURL(url);
      }
    });
    return { action: 'deny' };
  });

  EduNuageExam.mainWindow.webContents.on('dom-ready', function () {
    const currentURL = new URL(this.getURL())
    if (/^nuage[0-9]+\.apps\.education\.fr$/.test(currentURL.hostname) && currentURL.pathname.startsWith('/index.php/s/')) {
      // Il s'agit d'une url de partage, on déclenche la sécurisation !

      // Nextcloud va supprimer l'intégration si l'utilisateur ne choisi par de nom d'utilisateur avant 15s
      // On détecte cette suppression afin de la remettre si besoin ...
      // Cela évitera également que l'élève ferme par erreur le fichiers via le Menu Fichier > Fermer le document

      EduNuageExam.mainWindow.webContents.executeJavaScript(`
        const observer = new MutationObserver(records => {
          for (const {target, removedNodes} of records) {
              const element = Array.from(removedNodes).filter(x => x.id === "richdocumentsframe");
              if (element.length) {
                  document.body.appendChild(element[0], document.body);
              }
          }
        });
        observer.observe(document.body, {
            childList: true
        });
      0`);

      // On affiche une popup demandant si l'on souhaite démarer l'examen et on
      // indique que l'écran pourra être enregistrée et que l'accès au reste de
      // l'ordinateur sera bloquée

      dialog.showMessageBox(EduNuageExam.mainWindow, {
        type: 'question',
        buttons: ['Démarrer l\'examen', 'Annuler'],
        title: 'Démarrer l\'examen',
        message: 'Vous êtes sur le point de démarrer un examen EduNuage. L\'écran pourra être enregistré et l\'accès au reste de l\'ordinateur sera bloqué.',
        cancelId: 1,
        defaultId: 0,
      }).then((result) => {
        if (result.response === 0) { // Démarrer l'examen

          EduNuageExam.events.push({
            type: 'startExam',
            time: new Date().getTime()
          });

          // On vide le presse papier
          clipboard.clear();

          // On met la fenêtre en plein écran et toujours au premier plan
          EduNuageExam.mainWindow.setFullScreen(true);
          EduNuageExam.mainWindow.setAlwaysOnTop(true, 'pop-up-menu');

          EduNuageExam.mainWindow.webContents.setWindowOpenHandler(({ url }) => {
            // On le log pas cette url car l'élève a peut-être juste clic sur le logo en haut à gauche par erreur ...
            if (url === 'https://www.collaboraoffice.com/') return { action: 'deny' };

            const event = {
              type: 'triedOpenUrl',
              time: new Date().getTime(),
              data: url
            };
            EduNuageExam.events.push(event);
            screenshot({ filename: `./data/${event.time}-${event.type}-${EduNuageExam.events.length}.jpg` })
            return { action: 'deny' };
          });

          const menu = Menu.buildFromTemplate(
            [
              {
                label: 'EduNuageExam',
                submenu: [
                  {
                    label: "Quitter l'examen",
                    click: () => {
                      EduNuageExam.willOpenDialog = true;
                      dialog.showMessageBox(EduNuageExam.mainWindow, {
                        type: 'question',
                        buttons: ['Quitter l\'examen', 'Annuler'],
                        title: 'Quitter l\'examen',
                        message: 'Vous êtes sur le point de quitter un examen. Cette action est irréversible et ne doit être faite que sous la surveillance de l\'enseignant.',
                        // checkboxLabel: 'Je confirme que mon enseignant m\'a autorisé à quitter l\'examen',
                        cancelId: 1,
                        defaultId: 0,
                      }).then((result) => {
                        if (result.response === 0 /*&& result.checkboxChecked*/) {
                          EduNuageExam.events.push({
                            type: 'quitExam',
                            time: new Date().getTime()
                          });
                          const report = {
                            resume: `Début : ${new Date(EduNuageExam.events[0].time).toLocaleString()}
                              Fin: ${new Date(EduNuageExam.events[EduNuageExam.events.length - 1].time).toLocaleString()}
                              Durée : ${Math.round((EduNuageExam.events[EduNuageExam.events.length - 1].time - EduNuageExam.events[0].time) / 1000 / 60)} minutes`
                              .replace(/^\s+/gm, ''),
                            details: EduNuageExam.events.map((event) => `${new Date(event.time).toLocaleTimeString()} : ${event.type}`
                              + (event.data ? ` (${event.data})` : '')).join('\n')
                          }
                          EduNuageExam.willOpenDialog = true;
                          Promise.allSettled(
                            [
                              dialog.showMessageBox(EduNuageExam.mainWindow, {
                                type: EduNuageExam.events.length == 2 ? 'info' : 'error',
                                buttons: ['Ok'],
                                title: 'Examin terminé',
                                message: report.resume,
                                detail: report.details,
                                defaultId: 0
                              }),
                              fsPromise.writeFile(
                                './data/report-' + EduNuageExam.events[0].time + '.txt',
                                `${report.resume}
                                -----------------------
                                ${report.details}`.replace(/^\s+/gm, '')
                              )
                            ]
                          ).then((result) => {
                            app.quit();
                          });
                        } else {
                          const event = {
                            type: 'triedToQuitExam',
                            time: new Date().getTime()
                          };
                          EduNuageExam.events.push(event);
                          EduNuageExam.gotBlurred = true;
                          screenshot({ filename: `./data/${event.time}-${event.type}-${EduNuageExam.events.length}.jpg` })
                          setTimeout(() => {
                            screenshot({ filename: `./data/${event.time}-${event.type}-${EduNuageExam.events.length}-1.jpg` })
                          }, 1000);
                          setTimeout(() => {
                            screenshot({ filename: `./data/${event.time}-${event.type}-${EduNuageExam.events.length}-2.jpg` })
                          }, 5000);
                          setTimeout(() => {
                            screenshot({ filename: `./data/${event.time}-${event.type}-${EduNuageExam.events.length}-3.jpg` })
                          }, 10000);
                          setTimeout(() => {
                            screenshot({ filename: `./data/${event.time}-${event.type}-${EduNuageExam.events.length}-4.jpg` })
                          }, 30000);
                        }
                      });
                    }
                  },
                  { // On désactive le raccourci Alt+F4
                    label: 'No altF4',
                    accelerator: 'Alt+F4',
                    visible: false
                  }
                ],
              }
            ]
          );

          EduNuageExam.mainWindow.setMenu(menu);

          EduNuageExam.mainWindow.webContents.on('frame-created', function (event, details) {
            // La page principale va avoir de nombreuses iframe et l'éditeur est dans l'une d'entre elle
            // On surveille les iframes créer et on regarde si l'url de l'iframe correspond à l'éditeur
            // (voir aussi did-frame-navigate mais qui semble moins complet)
            // Si c'est le cas on désactive le menu Outil
            // Il faut pour cela attendre que la page soit chargée et que le menu soit disponible
            // Il faut donc utiliser un setInterval sinon le menu n'est pas encore disponible

            details.frame.on('dom-ready', function () {
              if (new URL(this.url).hostname === 'edition.apps.education.fr') {
                details.frame.executeJavaScript(`
                let EduNuageExamInterval = setInterval(function() {
                  if(document.getElementById('menu-tools')) {
                    document.getElementById('menu-tools').classList.add('ui-state-disabled');
                    clearInterval(EduNuageExamInterval);
                  }
                },1000);
                0`);
              }
            });

          });

          EduNuageExam.mainWindow.webContents.on('blur', function () {
            if (EduNuageExam.willOpenDialog) {
              EduNuageExam.willOpenDialog = false;
              return;
            }
            EduNuageExam.gotBlurred = true;
            const event = {
              type: 'blur',
              time: new Date().getTime()
            };
            EduNuageExam.events.push(event);
            screenshot({ filename: `./data/${event.time}-${event.type}-${EduNuageExam.events.length}.jpg` })
            setTimeout(() => {
              screenshot({ filename: `./data/${event.time}-${event.type}-${EduNuageExam.events.length}-1.jpg` })
            }, 1000);
            setTimeout(() => {
              screenshot({ filename: `./data/${event.time}-${event.type}-${EduNuageExam.events.length}-2.jpg` })
            }, 5000);
            setTimeout(() => {
              screenshot({ filename: `./data/${event.time}-${event.type}-${EduNuageExam.events.length}-3.jpg` })
            }, 10000);
            setTimeout(() => {
              screenshot({ filename: `./data/${event.time}-${event.type}-${EduNuageExam.events.length}-4.jpg` })
            }, 30000);
          });

          EduNuageExam.mainWindow.webContents.on('focus', function () {
            if (!EduNuageExam.gotBlurred) {
              return;
            }
            EduNuageExam.gotBlurred = false;
            const event = {
              type: 'focus',
              time: new Date().getTime()
            };
            EduNuageExam.events.push(event);
            screenshot({ filename: `./data/${event.time}-${event.type}-${EduNuageExam.events.length}.jpg` })
            setTimeout(() => {
              screenshot({ filename: `./data/${event.time}-${event.type}-${EduNuageExam.events.length}-1.jpg` })
            }, 1000);
            setTimeout(() => {
              screenshot({ filename: `./data/${event.time}-${event.type}-${EduNuageExam.events.length}-2.jpg` })
            }, 5000);
            setTimeout(() => {
              screenshot({ filename: `./data/${event.time}-${event.type}-${EduNuageExam.events.length}-3.jpg` })
            }, 10000);
            setTimeout(() => {
              screenshot({ filename: `./data/${event.time}-${event.type}-${EduNuageExam.events.length}-4.jpg` })
            }, 30000);
          });

        } else {
          if (EduNuageExam.mainWindow.webContents.canGoBack()) {
            EduNuageExam.mainWindow.webContents.goBack();
          } else {
            app.quit();
          }
        }
      });
    }
  });


  fsPromise.mkdir('./data/', { recursive: true }).then(() => {
    // On créé le dossier qui contiendra les captures d'écrans
    // recursive: true évite une erreur si le dossier existe déjà
    fsPromise.readFile('home.txt', { encoding: 'utf8' }).then((result) => {
      const url = new URL(result);
      if (url.protocol !== 'https:' && url.protocol !== 'http:') {
        throw new Error('Protocole non supporté');
      }
      EduNuageExam.mainWindow.loadURL(url.href);
    }).catch((e) => {
      EduNuageExam.mainWindow.loadURL('https://www.google.fr')
    });
  });
});

/*
app.on("browser-window-created", (e, win) => {
  win.setAutoHideMenuBar(true);
  win.setMenuBarVisibility(false);
});
*/

app.on('window-all-closed', function () {
  app.quit()
});