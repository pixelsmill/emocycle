if(typeof(loc)=="undefined"||loc==""){var loc="";if(document.body&&document.body.innerHTML){var tt=document.body.innerHTML.toLowerCase();var last=tt.indexOf("red.js\"");if(last>0){var first=tt.lastIndexOf("\"",last);if(first>0&&first<last)loc=document.body.innerHTML.substr(first+1,last-first-1);}}}

var bd=1
document.write("<style type=\"text/css\">");
document.write("\n<!--\n");
document.write(".red_menu {border-color:#000000;border-style:solid;border-width:"+bd+"px 0px "+bd+"px 0px;background-color:#ffcccc;position:absolute;left:0px;top:0px;visibility:hidden;}");
document.write("a.red_plain:link, a.red_plain:visited{text-align:left;background-color:#ffccff;color:#663366;text-decoration:none;border-color:#000000;border-style:solid;border-width:0px "+bd+"px 0px "+bd+"px;padding:2px 0px 2px 0px;cursor:hand;display:block;font-size:8pt;font-family:Arial, Helvetica, sans-serif;font-weight:bold;}");
document.write("a.red_plain:hover, a.red_plain:active{background-color:#864186;color:#e6d3f1;text-decoration:none;border-color:#000000;border-style:solid;border-width:0px "+bd+"px 0px "+bd+"px;padding:2px 0px 2px 0px;cursor:hand;display:block;font-size:8pt;font-family:Arial, Helvetica, sans-serif;font-weight:bold;}");
document.write("a.red_l:link, a.red_l:visited{text-align:left;background:#ffccff url("+loc+"red_l.gif) no-repeat right;color:#663366;text-decoration:none;border-color:#000000;border-style:solid;border-width:0px "+bd+"px 0px "+bd+"px;padding:2px 0px 2px 0px;cursor:hand;display:block;font-size:8pt;font-family:Arial, Helvetica, sans-serif;font-weight:bold;}");
document.write("a.red_l:hover, a.red_l:active{background:#864186 url("+loc+"red_l2.gif) no-repeat right;color: #e6d3f1;text-decoration:none;border-color:#000000;border-style:solid;border-width:0px "+bd+"px 0px "+bd+"px;padding:2px 0px 2px 0px;cursor:hand;display:block;font-size:8pt;font-family:Arial, Helvetica, sans-serif;font-weight:bold;}");
document.write("\n-->\n");
document.write("</style>");

var fc=0xe6d3f1;
var bc=0x864186;
if(typeof(frames)=="undefined"){var frames=0;}

startMainMenu("red_left.gif",30,10,2,0,0)
mainMenuItem("red_b1",".gif",30,143,"http://redpsy.com/editions/","","Publications",2,2,"red_plain");
mainMenuItem("red_b2",".gif",30,143,"http://redpsy.com/virtuel/","","Services Online",2,2,"red_plain");
mainMenuItem("red_b3",".gif",30,143,"http://redpsy.com/index.html#aide","","Services professionnels",2,2,"red_plain");
mainMenuItem("red_b4",".gif",30,143,"http://redpsy.com/plan.html","","À propos de ce site",2,2,"red_plain");
endMainMenu("red_right.gif",30,10)

startSubmenu("red_b4_8","red_menu",142);
submenuItem("Comment s'y rendre","http://www.redpsy.com/planred.html#route","","red_plain");
submenuItem("Situation géographique","http://www.redpsy.com/planred.html#plan","","red_plain");
endSubmenu("red_b4_8");

startSubmenu("red_b4","red_menu",193);
submenuItem("Menu principal","http://redpsy.com/","","red_plain");
submenuItem("Quoi de neuf sur le site","http://redpsy.com/nouveau.html","","red_plain");
submenuItem("Recherche sur ce site","http://redpsy.com/recherche.html","","red_plain");
submenuItem("Plan du site","http://redpsy.com/plan.html","","red_plain");
submenuItem("---","javascript:;","","red_plain");
submenuItem("Qui est ReD ?","http://redpsy.com/red.html","","red_plain");
submenuItem("Pour communiquer avec ReD","http://www.redpsy.com/planred.html","","red_plain");
mainMenuItem("red_b4_8","Où c'est ? ",0,0,"http://www.redpsy.com/planred.html#route","","",1,1,"red_l");
submenuItem("---","javascript:;","","red_plain");
submenuItem("Mise en garde","http://redpsy.com/engarde.html","","red_plain");
submenuItem("Copyright","http://redpsy.com/copyright.html","","red_plain");
endSubmenu("red_b4");

startSubmenu("red_b3_4","red_menu",131);
submenuItem("Qu'est-ce que c'est ?","http://redpsy.com/babillard.html","","red_plain");
submenuItem("Accès au Babillard","http://www.infopsy.com/cgi-bin/gforum.cgi?","","red_plain");
endSubmenu("red_b3_4");

startSubmenu("red_b3_3_2","red_menu",129);
submenuItem("Liste des articles","http://redpsy.com/infopsy/#titres","","red_plain");
submenuItem("Les sentiers Infopsy","http://www.redpsy.com/infopsy/sentiers.html","","red_plain");
endSubmenu("red_b3_3_2");

startSubmenu("red_b3_3_1","red_menu",125);
submenuItem("Abonnement gratuit","http://redpsy.com/letpsy/index.html#abonnement","","red_plain");
submenuItem("Archives","http://redpsy.com/archives.html","","red_plain");
endSubmenu("red_b3_3_1");

startSubmenu("red_b3_3","red_menu",197);
mainMenuItem("red_b3_3_1","La lettre du Psy (ezine)",0,0,"http://redpsy.com/letpsy/","","",1,1,"red_l");
mainMenuItem("red_b3_3_2","Infopsy (articles)",0,0,"http://redpsy.com/infopsy/","","",1,1,"red_l");
submenuItem("Le guide des émotions","http://redpsy.com/guide/","","red_plain");
submenuItem("Le coffre d'outils","http://redpsy.com/outils/","","red_plain");
submenuItem("Images intérieures (poèmes)","http://redpsy.com/images/","","red_plain");
endSubmenu("red_b3_3");

startSubmenu("red_b3","red_menu",244);
submenuItem("Réponses aux questions individuelles","http://redpsy.com/virtuel/questions.html","","red_plain");
submenuItem("Consultation suivie par email","http://redpsy.com/virtuel/i-consultation.html","","red_plain");
mainMenuItem("red_b3_3","Centre de documentation",0,0,"javascript:;","","",1,1,"red_l");
mainMenuItem("red_b3_4","Babillard infopsy",0,0,"http://redpsy.com/babillard.html","","",1,1,"red_l");
endSubmenu("red_b3");

startSubmenu("red_b2_7","red_menu",125);
submenuItem("Sessions et ateliers","http://www.redpsy.com/actpaiement.html","","red_plain");
submenuItem("Psychothérapie","http://www.redpsy.com/planred.html#rv","","red_plain");
endSubmenu("red_b2_7");

startSubmenu("red_b2_6","red_menu",132);
submenuItem("La méthode","http://www.redpsy.com/therapie.html#choisir","","red_plain");
submenuItem("Un psychothérapeute","http://www.provirtuel.com/doc/choix-ther.html","","red_plain");
endSubmenu("red_b2_6");

startSubmenu("red_b2_3","red_menu",189);
submenuItem("Prendre ma place","http://www.redpsy.com/ateliers.html#place","","red_plain");
submenuItem("Vaincre la dépendance affective","http://www.redpsy.com/ateliers.html#depaff","","red_plain");
endSubmenu("red_b2_3");

startSubmenu("red_b2_2","red_menu",155);
submenuItem("Vivre avec mes émotions","http://www.redpsy.com/sessionsgroupead.html#emo","","red_plain");

submenuItem("Résoudre mes transferts","http://www.redpsy.com/sessionsgroupead.html#noeuds-session","","red_plain");
endSubmenu("red_b2_2");

startSubmenu("red_b2_1","red_menu",77);
submenuItem("Individuelle","http://www.redpsy.com/therapie.html#individuelle","","red_plain");
submenuItem("Conjugale","http://www.redpsy.com/therapie.html#couple","","red_plain");
submenuItem("De groupe","http://www.redpsy.com/therapie.html#groupe","","red_plain");
endSubmenu("red_b2_1");

startSubmenu("red_b2","red_menu",187);
mainMenuItem("red_b2_1","Psychothérapie",0,0,"http://www.redpsy.com/therapie.html","","",1,1,"red_l");
mainMenuItem("red_b2_2","Session intensives",0,0,"http://www.redpsy.com/sessionsgroupead.html","","",1,1,"red_l");
mainMenuItem("red_b2_3","Ateliers",0,0,"http://www.redpsy.com/ateliers.html","","",1,1,"red_l");
submenuItem("---","javascript:;","","red_plain");
submenuItem("Calendrier des activités","http://www.redpsy.com/calendrier.html","","red_plain");
mainMenuItem("red_b2_6","Comment choisir",0,0,"javascript:;","","",1,1,"red_l");
mainMenuItem("red_b2_7","Inscriptions et rendez-vous",0,0,"javascript:;","","",1,1,"red_l");
endSubmenu("red_b2");

startSubmenu("red_b1_3_3","red_menu",182);
submenuItem("--- SIGNALER VOTRE INTÉRÊT ---","http://redpsy.com/editions/exo.html#averti","","red_plain");
endSubmenu("red_b1_3_3");

startSubmenu("red_b1_3_2","red_menu",137);
submenuItem(" --- POUR S'INSCRIRE ---","http://www.redpsy.com/editions/sro.html#inscription","","red_plain");
endSubmenu("red_b1_3_2");

startSubmenu("red_b1_3_1","red_menu",150);
submenuItem(" --- POUR COMMANDER ---","http://www.redpsy.com/editions/sr.html#commande","","red_plain");
endSubmenu("red_b1_3_1");

startSubmenu("red_b1_3","red_menu",248);
mainMenuItem("red_b1_3_1","Savoir Ressentir (2e édition)",0,0,"http://www.redpsy.com/editions/sr.html","","",1,1,"red_l");
mainMenuItem("red_b1_3_2","Savoir Ressentir (Online)",0,0,"http://www.redpsy.com/editions/sro.html","","",1,1,"red_l");
mainMenuItem("red_b1_3_3","Maîtriser l'expression efficace (Online)",0,0,"http://redpsy.com/editions/exo.html","","",1,1,"red_l");
endSubmenu("red_b1_3");

startSubmenu("red_b1_2_5_2","red_menu",124);
submenuItem("Livraison au Canada","http://www.redpsy.com/publicda.html","","red_plain");
submenuItem("Livraison aux USA","http://www.redpsy.com/livresus.html","","red_plain");
submenuItem("Livraison ailleurs","http://www.redpsy.com/livreuro.html","","red_plain");
endSubmenu("red_b1_2_5_2");

startSubmenu("red_b1_2_5_1","red_menu",124);
submenuItem("Livraison au Canada","http://www.redpsy.com/cc-canada.php","","red_plain");
submenuItem("Livraison aux USA","http://www.redpsy.com/cc-livresus.html","","red_plain");
submenuItem("Livraison ailleurs","http://www.redpsy.com/cc-livreuro.php","","red_plain");
endSubmenu("red_b1_2_5_1");

startSubmenu("red_b1_2_5","red_menu",234);
mainMenuItem("red_b1_2_5_1","Directement sur notre site",0,0,"javascript:;","","",1,1,"red_l");
mainMenuItem("red_b1_2_5_2","Par la poste, par fax, par téléphone...",0,0,"javascript:;","","",1,1,"red_l");
endSubmenu("red_b1_2_5");

startSubmenu("red_b1_2","red_menu",230);
submenuItem("La puissance des émotions (2 CD)","http://www.redpsy.com/editions/puissance.html#cd","","red_plain");
submenuItem("L'angoisse et l'anxiété (Audio-ROM)","http://www.redpsy.com/editions/anx.html","","red_plain");
submenuItem("La confiance en soi (Audio-ROM)","http://www.redpsy.com/editions/conf.html","","red_plain");
submenuItem("Le burnout (Audio-ROM)","http://www.redpsy.com/editions/burn.html","","red_plain");
submenuItem("Refuser d'être victime (Audio-ROM)","http://www.redpsy.com/editions/victime.html","","red_plain");
submenuItem("La jalousie amoureuse (Audio-ROM)","http://www.redpsy.com/editions/jalousie.html","","red_plain");
submenuItem("Le stress (Audio-ROM)","http://www.redpsy.com/editions/stress.html","","red_plain");
submenuItem("---","javascript:;","","red_plain");
mainMenuItem("red_b1_2_5"," --- POUR COMMANDER ---",0,0,"http://www.redpsy.com/editions/anx.html#commande","","",1,1,"red_l");
endSubmenu("red_b1_2");

startSubmenu("red_b1_1_8_2","red_menu",124);
submenuItem("Livraison au Canada","http://www.redpsy.com/publicda.html","","red_plain");
submenuItem("Livraison aux USA","http://www.redpsy.com/livresus.html","","red_plain");
submenuItem("Livraison ailleurs","http://www.redpsy.com/livreuro.html","","red_plain");
endSubmenu("red_b1_1_8_2");

startSubmenu("red_b1_1_8_1","red_menu",124);
submenuItem("Livraison au Canada","http://www.redpsy.com/cc-canada.php","","red_plain");
submenuItem("Livraison aux USA","http://www.redpsy.com/cc-livresus.html","","red_plain");
submenuItem("Livraison ailleurs","http://www.redpsy.com/cc-livreuro.php","","red_plain");
endSubmenu("red_b1_1_8_1");

startSubmenu("red_b1_1_8","red_menu",234);
mainMenuItem("red_b1_1_8_1","Directement sur notre site",0,0,"javascript:;","","",1,1,"red_l");
mainMenuItem("red_b1_1_8_2","Par la poste, par fax, par téléphone...",0,0,"javascript:;","","",1,1,"red_l");
endSubmenu("red_b1_1_8");

startSubmenu("red_b1_1","red_menu",203);
submenuItem("Le défi des relations (nouveau)","http://redpsy.com/editions/transfert.html","","red_plain");
submenuItem("Les émotions source de vie","http://redpsy.com/editions/emotions.html","","red_plain");
submenuItem("L'enfer de la fuite","http://redpsy.com/editions/enfer.html","","red_plain");
submenuItem("La puissance des émotions","http://redpsy.com/editions/puissance.html","","red_plain");
submenuItem("L'Auto-développement","http://www.redpsy.com/editions/ad.html","","red_plain");
submenuItem("Le guide du psychothérapeute","http://www.redpsy.com/editions/guide.html","","red_plain");
submenuItem("Ravage et... délivrance","http://www.redpsy.com/editions/ravage.html","","red_plain");
submenuItem("---","javascript:;","","red_plain");
mainMenuItem("red_b1_1_8"," --- POUR COMMANDER ---",0,0,"http://www.redpsy.com/editions/ad.html#commande","","",1,1,"red_l");
endSubmenu("red_b1_1");

startSubmenu("red_b1","red_menu",143);
mainMenuItem("red_b1_1","Livres",0,0,"http://redpsy.com/editions/","","",1,1,"red_l");
mainMenuItem("red_b1_2","Livres audio sur CD",0,0,"javascript:;","","",1,1,"red_l");
mainMenuItem("red_b1_3","Programmes",0,0,"javascript:;","","",1,1,"red_l");
endSubmenu("red_b1");

loc="";
