// fonction prenant en paramêtre le numero de End Device pour effectuer un filtre sur devEUI et renvoyer les données voulues
function searchAndReturnEndDevice(receiveArray, deviceNumber) {

  receiveArray = JSON.parse(receiveArray.data)

  for (let i=0; i < receiveArray.length; i++) {
     if (receiveArray[i].devEUI === "f1f2f3430100000" + deviceNumber) {

       // Valeurs de receiveArray[i].data sont les composantes du vecteur gravité 'unitaire' (1.57 len)
       var angleX = Math.atan2(-receiveArray[i].data.angleZ, receiveArray[i].data.angleY) - Math.PI/2
       angleX = (angleX < 0 ? 2*Math.PI + angleX : angleX) * 180/Math.PI

       // Valeurs de receiveArray[i].data sont les composantes du vecteur gravité 'unitaire' (1.57 len)
       var angleY = Math.atan2(receiveArray[i].data.angleX, -receiveArray[i].data.angleZ) - Math.PI/2
       angleY = (angleY < 0 ? 2*Math.PI + angleY : angleY) * 180/Math.PI

       // Valeurs de receiveArray[i].data sont les composantes du vecteur gravité 'unitaire' (1.57 len)
       var angleZ = Math.atan2(receiveArray[i].data.angleX, receiveArray[i].data.angleY) - Math.PI/2
       angleZ = (angleZ < 0 ? 2*Math.PI + angleZ : angleZ) * 180/Math.PI

       return {
          angleX : angleX,
          angleY : angleY,
          angleZ : angleZ
       };
     }
 }

 return 0
}

// fonction créant un objet javascript "posture" (voir documentation) necessaire à des transitions 'smooth'
function posture(angleTorse, angleJambes, angleGenoux) {

CORPS = angleTorse
JAMBE = -(angleJambes-angleTorse)
GENOU = angleGenoux-angleJambes
PIED = -(CORPS - JAMBE + GENOU)

return {"version":7,"data":[[0,3.8,0],[CORPS,-90,0],[0,0,-2],[0,0,5],[6,0,JAMBE],[GENOU],[-6,-6,PIED],[-6,0,JAMBE],[GENOU],[6,6,PIED],[7,-0.6,-5],[15],[5,0,0],[-90,70,75,0,10,0,10],[0,0,10,0,10,0,10],[0,0,10,0,10,0,10],[0,0,10,0,10,0,10],[0,0,10,0,10,0,10],[-7,0.6,-5],[15],[-5,0,0],[90,-70,75,0,10,0,10],[0,0,10,0,10,0,10],[0,0,10,0,10,0,10],[0,0,10,0,10,0,10],[0,0,10,0,10,0,10]]}
         
}

// fonction utilisée dans la fonction changementEtatBoutons (même .js, la suivante)
function changementEtatAssise(angleTorse, angleJambes) {

  if (Math.abs(angleJambes) <= 50) {
    return 0
  }

  else if (Math.abs(angleTorse) <= 45 && -angleJambes >= 45) {
    return 1
  }

  else {
    return 2
  }
}

// fonction attribuant au bon bouton l'état "actif" en fonction de la position de la personne
function changementEtatBoutons (angleTorse, angleJambes) {
bouton_debout.classList.remove("buttonActivate"); bouton_assis.classList.remove("buttonActivate"); bouton_allonge.classList.remove("buttonActivate")
switch (changementEtatAssise(angleTorse, angleJambes)) {

   case 0 :
      bouton_debout.classList.add("buttonActivate")
      break;
   case 1 :
      bouton_assis.classList.add("buttonActivate")
      break;
   case 2 :
      bouton_allonge.classList.add("buttonActivate")
      break;
}
}

// fonction pour activer ou non le déplacement au clique de la souris
function toggleOrbitsControls(toggle) {
  controls.enabled = toggle
}

// fonction ramenant une valeur comprise entre +/- 360 à +/- 180
// necessaire car le Mannequin.blend() (../index.html:84)
// nécessite des valeurs comprises entre -180 et +180 sinon
// il tournera sur lui même n'atteignant jamais la valeur cherchée
function rebaseAngle(angle) {

  return Math.abs(angle) >= 180 ? angle <= 0 ? angle + 360 : angle - 360 : angle
}


previousPosition = -1 // état n-1 de 'etatAssise'
tempsAvantAlerte = 10 // temps défini en dur pouvant être redéfini par l'utilisateur

// fonction lançant un setInterval de 1000ms changeant la valeur de la variable de comptage
function setTimeInPosition() {
  setInterval(() => {
    time = parseInt(compteurVariable.innerText) // valeur actuelle de comptage
  
    const etatAssise = changementEtatAssise(angleTorse, angleJambes) // position actuelle

    if (previousPosition != etatAssise) {
  
      compteurVariable.innerText = time = 0
  
      previousPosition = etatAssise
    }
  
    else if (etatAssise != 0) {
  
      compteurVariable.innerText = time = time + 1
    }

    if (time < tempsAvantAlerte) {

      //change la couleur de sombre à rouge en fonction de tempsAvantAlerte
      compteur.style.color = `rgb(${time*(255/(tempsAvantAlerte + 1))}, 25, 25)`
      compteurAlerte.innerText = null // n'affiche pas le paneau attention
    }

    else {

      compteurAlerte.innerText = "⚠"
    }
  }, 1000)
}

// fonction affichant une boite de dialogue pour parametrer le temps avant alerte
function setTimeBeforeAlert() {

  do {

    tempsAvantAlerte = parseInt(prompt("écrivez une valeur entière positive :"))

  } while (tempsAvantAlerte <= 0)
}