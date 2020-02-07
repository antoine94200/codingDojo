
var tabScoreU1=[];
var tabScoreU2=[];
var L=0;
var o=0;

// Recuperation du canvas
var c = document.getElementById("canvasMorpion");
var ctx = c.getContext("2d");

// Recuperation tailles
var largeur = c.width;
var hauteur = c.height;

// Choix taille grille
var nbColonnes = 3 ;
var nbLignes = 3 ;

// Calcul taille cases
var hauteurLigne = hauteur/nbLignes ;
var largeurColonne = largeur/nbColonnes ;

// Choix aspect croix
var ratioCroix = 0.7 ;
var epaisseurCroix = 1 ;
var couleurCroix = "blue";

// Choix aspect rond
var ratioRond = 0.7 ;
var epaisseurRond = 1 ;
var couleurRond = "red";
var rayonRond = largeurColonne ;
if(largeurColonne > hauteurLigne)
{
	rayonRond = hauteurLigne ;
}
rayonRond /= 2;
rayonRond *= ratioRond ;


// Choix de la victoire
var nbCoupsVictoire = 3 ;

// Couleur de fond du canvas + contour
ctx.fillStyle = "white" ;
ctx.strokeStyle = "black";
ctx.fillRect(0,0,largeur,hauteur);
ctx.strokeRect(0,0,largeur,hauteur);

// Initialisation du jeu
var jeu = true ;
var joueurActuel = true;
var coups = [];

// Creation de la grille lignes*colonnes
ctx.beginPath()
ctx.lineWidth = 1;
ctx.strokeStyle = "black";


// Creation de la grille physique
for(var i = 0 ; i < nbLignes-1 ; i++) 
{
	// Creation ligne
	ctx.moveTo(0,(i+1)*(hauteurLigne));
	ctx.lineTo(largeur,(i+1)*(hauteurLigne));
	ctx.stroke();
}
for(var j = 0 ; j < nbColonnes-1 ; j++) // Creation colonne
{
	// Creation case (colonne)
	ctx.moveTo((j+1)*(largeurColonne),0);
	ctx.lineTo((j+1)*(largeurColonne),hauteur);
	ctx.stroke();
}

ctx.closePath();


// Evenement clic
c.addEventListener("click", play, false);

// Creation du tableau pour la grille
for(var i = 0 ; i < nbLignes ; i++)
{
	for(var j = 0 ; j < nbColonnes ; j++) 
	{		
		coups.push([]);	
		coups[i].push(false);
	}
}

// Creation de croix
function createCroix(x,y)
{
	// x,y est le centre de la croix
	ctx.beginPath();
	ctx.lineWidth = epaisseurCroix;
	ctx.strokeStyle  = couleurCroix;
	ctx.moveTo(x - (largeurColonne/2)*ratioCroix, y - (hauteurLigne/2)*ratioCroix );
	ctx.lineTo(x + (largeurColonne/2)*ratioCroix, y + (hauteurLigne/2)*ratioCroix );

	ctx.moveTo(x + (largeurColonne/2)*ratioCroix, y - (hauteurLigne/2)*ratioCroix );
	ctx.lineTo(x - (largeurColonne/2)*ratioCroix, y + (hauteurLigne/2)*ratioCroix );

	ctx.stroke();
	ctx.closePath();
}

// Creation de rond
function createRond(x,y)
{
	// x,y est le centre du rond
	ctx.beginPath();
	ctx.lineWidth = epaisseurRond ;
	ctx.strokeStyle = couleurRond ;
	ctx.arc(x,y,rayonRond,0,2*Math.PI);
	ctx.stroke();
}




// Verification gagnant
function gain(symbole,y,x) // on va chercher a verifier si il y a N symboles identiques alignés
{
	var test = 0 ;

	// Verification sur la meme ligne = sur le meme Y
	for(var i=0 ; i < nbColonnes ; i++)
	{
		if(coups[y][i]==symbole)
		{
			test++;
			if(test>=nbCoupsVictoire)
			{
				return true ;
			}
		}
		else
		{
			test = 0 ;
		}
	}

	test = 0 ;
	// Verification sur la meme colonne = sur le meme X
	for(var i=0 ; i < nbLignes ; i++)
	{
		if(coups[i][x]==symbole)
		{
			test++;
			if(test>=nbCoupsVictoire)
			{
				return true ;
			}
		}
		else
		{
			test = 0 ;
		}
	}

	var x2 = x*1 ;
	var y2 = y*1 ;
	// Verification diagonale descendante
	while(x2>0 && y2>0)
	{
		x2--;
		y2--;
	}

	test = 0;
	while(x2<nbColonnes && y2<nbLignes)
	{
		if(coups[y2][x2] == symbole)
		{
			test ++ ;
			if(test>=nbCoupsVictoire)
			{
				return true ;
			}
		}
		else
		{
			test = 0 ;
		}
		x2 ++;
		y2 ++;
	}

	x2 = x*1 ;
	y2 = y*1 ;
	// Verification diagonale asscendante
	while(x2<nbColonnes-1 && y2>0)
	{
		x2++;
		y2--;
	}

	test = 0;
	while(x2>=0 && y2<nbLignes)
	{
		if(coups[y2][x2] == symbole)
		{
			test ++ ;
			if(test>=nbCoupsVictoire)
			{
				return true ;
			}
		}
		else
		{
			test = 0 ;
		}
		x2 --;
		y2 ++;
	}

	return false;
}

// Lorsqu on clique
function play(event)
{
	x = event.clientX - c.offsetLeft ;
	y = event.clientY - c.offsetTop + document.documentElement.scrollTop;

	var caseX = parseInt(x/(largeur/nbColonnes));
	var caseY = parseInt(y/(hauteur/nbLignes));

	var milieuX = caseX*largeurColonne + largeurColonne/2 ;
	var milieuY = caseY*hauteurLigne + hauteurLigne/2 ;

	// Verification fin
	function end()
{
	for(var  i = 0 ; i < nbLignes ; i++)
	{
		for(var j = 0 ; j < nbColonnes ; j++)
		{
			if(coups[i][j] == false)
			{
				return false ;
			}
		}
	}
	return true ;
}

	if(jeu) // Si jeu en route
	{
		if(!coups[caseY][caseX]) // Si pas déjà quelque chose sur la meme case
		{
			if(joueurActuel)
			{
				createCroix(milieuX,milieuY);
				coups[caseY][caseX] = "croix" ; 
				var temp = "croix";
				document.getElementById("joueur").innerHTML = "Au joueur de placer un rond";
			}
			else
			{
				createRond(milieuX,milieuY);
				coups[caseY][caseX] = "rond" ; 
				var temp = "rond";
				document.getElementById("joueur").innerHTML = "Au joueur de placer une croix";
			}

			joueurActuel = !joueurActuel ;

			if(gain(temp,caseY,caseX))
			{
				if(joueurActuel)
				{
					document.getElementById("joueur").innerHTML = "Victoire pour le joueur rond !" ;
					jeu = false ;
					o++;
					tabScoreU1.push(o);
					//document.getElementById("rejouer").style.display = "initial";
					afficheScore();
				}
				else
				{
					document.getElementById("joueur").innerHTML = "Victoire pour le joueur croix !" ;
					jeu = false ;
					L++;
					tabScoreU2.push(L);
					//document.getElementById("rejouer").style.display = "initial";
					afficheScore();
				}
			}
			else
			{
				if(end())
				{
					jeu = false ;
					document.getElementById("joueur").innerHTML = "Terminé. Personne n'a gagné.";
					//document.getElementById("rejouer").style.display = "visible";
				}
			}
		}
	}

}


var startTime = 0
var start = 0
var end = 0
var diff = 0
var timerID = 0
//window.onload = chronoStart;
function chrono(){
	end = new Date()
	diff = end - start
	diff = new Date(diff)
	var msec = diff.getMilliseconds()
	var sec = diff.getSeconds()
	var min = diff.getMinutes()
	var hr = diff.getHours()-1
	if (min < 10){
		min = "0" + min
	}
	if (sec < 10){
		sec = "0" + sec
	}
	if(msec < 10){
		msec = "00" +msec
	}
	else if(msec < 100){
		msec = "0" +msec
	}
	document.getElementById("chronotime").value = hr + ":" + min + ":" + sec + ":" + msec
	timerID = setTimeout("chrono()", 10)
}
function chronoStart(){
	document.chronoForm.startstop.value = "stop!"
	document.chronoForm.startstop.onclick = chronoStop
	document.chronoForm.reset.onclick = chronoReset
	start = new Date()
	chrono()
}
function chronoContinue(){
	document.chronoForm.startstop.value = "stop!"
	document.chronoForm.startstop.onclick = chronoStop
	document.chronoForm.reset.onclick = chronoReset
	start = new Date()-diff
	start = new Date(start)
	chrono()
}
function chronoReset(){
	document.getElementById("chronotime").value = "0:00:00:000"
	start = new Date()
}
function chronoStopReset(){
	document.getElementById("chronotime").value = "0:00:00:000"
	document.chronoForm.startstop.onclick = chronoStart
}
function chronoStop(){
	document.chronoForm.startstop.value = "start!"
	document.chronoForm.startstop.onclick = chronoContinue
	document.chronoForm.reset.onclick = chronoStopReset
	clearTimeout(timerID)
}

function afficherU1(){
            var Mynamet = document.getElementById('caseU');
            var Myutil = document.getElementById('test1');
            Myutil.innerHTML = "Utilisateur numero 1: " + Mynamet.value;
            }

function afficherU2(){
            var Mynamet = document.getElementById('caseU2');
            var Myutil = document.getElementById('test2');
            Myutil.innerHTML = "Utilisateur numero 2 : " + Mynamet.value;
            }
function afficheScore(){
	var html='';
	html +='<div>'+"le score des croix est :" + tabScoreU2.length + '</div>';
	html +='<br>';
	html +='<div>'+"le score des ronds est :" + tabScoreU1.length + '</div>';
	document.getElementById('score').innerHTML=html;
}

/*function nouvellePartie(){
	localStorage.setItem('key', tabScoreU1);
	localStorage.setItem('key', tabScoreU2);

	localStorage.setItem('items', JSON.stringify(tabScoreU1))
const data = JSON.parse(localStorage.getItem('items'))

}*/




