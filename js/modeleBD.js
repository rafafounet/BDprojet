console.log('resolution actuelle:',window.innerWidth,'Pixels'); // pour checker la resolution responsive en console log



jQuery(document).ready(function ($) {
	const srcImg = "images/"; // emplacement des images de l'appli
	const albumDefaultMini = srcImg + "noComicsMini.jpeg";
	const albumDefault = srcImg + "noComics.jpeg";
	const srcAlbumMini = "albumsMini/"; // emplacement des images des albums en petit
	const srcAlbum = "albums/"; // emplacement des images des albums en grand
	let btnAchat= document.getElementById("Achat")
	

	// Affichage des BD
	var txtSerie = document.getElementById("serie");
	var txtNumero = document.getElementById("numero");
	var txtTitre = document.getElementById("titre");
	var txtAuteur = document.getElementById("auteur");
	var txtPrix = document.getElementById("prix");
	var imgAlbum = document.getElementById("album");
	var imgAlbumMini = document.getElementById("albumMini");
	let barreRecherche = document.getElementById('champRecherche');
	// console.log(albums)
	imgAlbum.addEventListener("error", function () {
		prbImg(this)
	});

	imgAlbumMini.addEventListener("error", function () {
		prbImg(this)
	});

	var id = document.getElementById("id");
	id.addEventListener("change", function () {
		console.log(this)
		getAlbum(this)

	});
///////////////////////////////   input recherche  ////////////////////////////////////

	const searchInput = document.getElementById('champRecherche');
	searchInput.addEventListener('keyup',function () { compare(this.value)});   //change
	

	// 	const input = searchInput.value;
	// 	console.log(input);
	// 	const result = randomArr.find(item => item.name.includes(input));  // find ou filter
	// 	console.log(result);

		
	// });

const randomArr = new Map();




function compare(parametre){	
for(const [key, item] of albums.entries()){
	console.log(key,item);
	console.log(parametre)
		
		// if(item.titre.includes(parametre)){
		// 	randomArr.push(item);
		// 	console.log(item)
		
		// }
		
	}
}
randomArr.forEach( (value, key, map) => {
	console.log(`${key}: ${value}:${map}`); // cucumber: 500 etc
  });




	/**
	 * Récupération de l'album par son id et appel de 
	 * la fonction d'affichage
	 *  
	 *  
	 * @param {number} num 
	 */
	
     


	function getAlbum(num) {
		
		console.log(num.value);
		if (albums.get(num)==undefined){
		var album = albums.get(num.value);}
		else {album = albums.get(num);}
		if (album === undefined) {
			txtSerie.value = "";
			txtNumero.value = "";
			txtTitre.value = "";
			txtAuteur.value = "";
			txtPrix.value = 0;
			//affichage par défaut
			afficheAlbums($("#albumMini"), $("#album"), albumDefaultMini, albumDefault);

		} else {

			var serie = series.get(album.idSerie);
			var auteur = auteurs.get(album.idAuteur);
			// console.log(serie)
			txtSerie.value = serie.nom;
			txtNumero.value = album.numero;
			txtTitre.value = album.titre;
			txtAuteur.value = auteur.nom;
			txtPrix.value = album.prix;
			// console.log(txtSerie.value );
			var nomFic = serie.nom + "-" + album.numero + "-" + album.titre;
			// Utilisation d'une expression régulière pour supprimer 
			// les caractères non autorisés dans les noms de fichiers : '!?.":$
			nomFic = nomFic.replace(/'|!|\?|\.|"|:|\$/g, "");
			btnAchat.addEventListener("click", ajoutPanier,false);  //au clic ajout au panier + somme des articles
			afficheAlbums(
				$("#albumMini"),
				$("#album"),
				srcAlbumMini + nomFic + ".jpg",
				srcAlbum + nomFic + ".jpg"
			);

		}
	}
	
	let setFiltre = document.getElementById("AffichageSelection");
	let filtreKey= document.getElementById("filtre");
	let AffichageFiltre = function (num){
	setFiltre.innerHTML="";
			for (const iterator of albums) {
		var album = albums.get(iterator[0]);
		var serie = series.get(album.idSerie);
		var auteur = auteurs.get(album.idAuteur);
				if ((album.titre.includes(filtreKey.value)||serie.nom.includes(filtreKey.value)||auteur.nom.includes(filtreKey.value))) {
				console.log(albumDefault);
				var nomFic = serie.nom + "-" + album.numero + "-" + album.titre;
				let Card =document.createElement("img")
				if (Card.src==undefined){
				Card.innerHTML=album.titre
				}else{
				Card.setAttribute("src", srcAlbum + nomFic + ".jpg")
				Card.setAttribute("src", srcAlbum + nomFic + ".jpg")
				setFiltre.appendChild(Card);}
				Card.addEventListener("click", function (){ getAlbum(iterator[0]); setFiltre.innerHTML=""})
}					
							
			}
			// AffichageFiltre();
	}
	
		
	// });
	/**
	 * Affichage des images, les effets sont chainés et traités
	 * en file d'attente par jQuery d'où les "stop()) et "clearQueue()" 
	 * pour éviter l'accumulation d'effets si défilement rapide des albums.
	 * 
	 * @param {object jQuery} $albumMini 
	 * @param {object jQuery} $album 
	 * @param {string} nomFic 
	 * @param {string} nomFicBig 
	 */
	function afficheAlbums($albumMini, $album, nomFicMini, nomFic) {
		$album.stop(true, true).clearQueue().fadeOut(100, function () {
			$album.attr('src', nomFic);
			$albumMini.stop(true, true).clearQueue().fadeOut(150, function () {
				$albumMini.attr('src', nomFicMini);
				$albumMini.slideDown(200, function () {
					$album.slideDown(200);
				});
			})
		});


	}
	
	/**
	 * Affichage de l'image par défaut si le chargement de l'image de l'album
	 * ne s'est pas bien passé
	 * 
	 * @param {object HTML} element 
	 */
	function prbImg(element) {
		// console.log(element);
		if (element.id === "albumMini")
			element.src = albumDefaultMini;
		else element.src = albumDefault;

	}

	/////////////////////////////////////////////   panier   ////////////////////////////
     
	
    
	let compteurAchat=0;
	
	let ajoutPanier = function () {                                  // fonction ajout panier
		let sommeAchat = document.getElementById('compteur');

		let Panier = document.getElementById("panier");
		let valideAchat = document.createElement("button");
		valideAchat.setAttribute("id", "btnRemove")
		valideAchat.innerHTML = "X";
		let Li = document.createElement("li");
		Li.setAttribute('id', 'prixObtenu');
		Li.innerHTML = (txtPrix.value + 'Euros');
		Li.appendChild(valideAchat);
		Panier.appendChild(Li);
		sommeAchat.innerHTML = (compteurAchat) += parseFloat(txtPrix.value);  //somme panier actuel + article validé
		// console.log(sommeAchat.innerHTML);


		function Remove() {
            Panier.removeChild(Li);
			Li.removeChild(valideAchat);
			sommeAchat.innerHTML = (compteurAchat) -= (txtPrix.value);// différence du prix acuel quand article effacé
	
			
		}
		valideAchat.addEventListener("click", Remove);
	}
	 
	
});





/////////////////////////////////////////////////////////////////////// side-bar  ////////////////////////////////////////////////////////////
const toggleButton = document.getElementById('toggle-button');//menu hamburger

const sideBar = document.getElementById('side-bar'); //side-bar

toggleButton.addEventListener('click', show); // declenche la fonction ci bas toggle menu

function show(){        //afficher enlever le menu hamburger
    sideBar.classList.toggle('active');
    
};
/////////////////////////////////////////////////////////////////////////// météo ///////////////////////////////////////////////////////////////

function buttonClickGET() { //météo
	let recherche = document.getElementById('rechercheVille').value;
 
    let url = "https://api.openweathermap.org/data/2.5/weather?q="+recherche+"&appid=c21a75b667d6f7abb81f118dcf8d4611&units=metric"

    $.get(url, callBackGetSuccess).done(function() {
        //alert( "2eme succés" );
      })
      .fail(function() {
        alert( "Cette ville n'existe pas" );
      })
      .always(function() {
        //alert( "terminé" );
      });
}
let callBackGetSuccess = function(data) {  //fonction callback
    let element = document.getElementById("zone_meteo");
    element.innerHTML = "La temperature est actuellement de " + data.main.temp +" degrés."; //affichage du résultat
}

/////////////////////////////////////////////////////////////////////////// date / heure /////////////////////////////////////////////////////////////////
   setInterval("horloge()", 1000);
   var aujourdhui = new Date(); 
	var annee = aujourdhui.getFullYear(); // retourne le millésime
	var mois =aujourdhui.getMonth()+1; // date.getMonth retourne un entier entre 0 et 11 donc il faut ajouter 1
	var jour = aujourdhui.getDate(); // retourne le jour (1à 31)
	var joursemaine = aujourdhui.getDay() ; // retourne un entier compris entre 0 et 6 (0 pour dimanche)
	var tab_jour=new Array("Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi");
	let ajouteDateBox=document.getElementById('dating');
	ajouteDateBox.innerText='Nous sommes le : ' +  tab_jour[joursemaine] + ' ' + jour + '/' + mois + '/' + annee  ; 

let boite = document.getElementById('hour'); //date et heure
function horloge() {
	const heure = new Date();
	var heureGMT = heure.toGMTString();
	boite.textContent = "il est : " + heure.getHours() + ":" + heure.getMinutes() + ":" + heure.getSeconds() /*+ " mais en GMT il est : " + heureGMT*/;
}
