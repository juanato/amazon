Components.utils.import("resource://imacros/utils.js");
Components.utils.import("resource://gre/modules/FileUtils.jsm");
Components.utils.import("resource://gre/modules/AddonManager.jsm");
Components.utils.import("resource://gre/modules/XPCOMUtils.jsm");
Components.utils.import("resource://gre/modules/Services.jsm");
Components.utils.import("resource://gre/modules/NetUtil.jsm");

const Cc = Components.classes;
const Ci = Components.interfaces;
const Cu = Components.utils;

  const CRLF = "\r\n";
  const LF = "\n";

  const cViaDts = getiMacrosFolder("DataSources") ;
  const cViaMac = getiMacrosFolder("Macros");
  const cRetLin = DetectaCR();
  const cDetBS = DetectaBS();
    
  const cVersion = "AMAZONRAPTOR 2.0 Captura url imágenes/variantes de un ficha de producto AMAZON";
  var document = window.content.document;
  var cMensaje = ">> ";
  var cFicErr = DameUnico()+"-amazon-descargar-errores.txt"
  var nComienzo = 0;
  var nFinal = 0;
  var oVariantesAmz = "";
  var oImagenesAmz = "";
  var aImagenesVolcar = new Array(); // Se usa para grabar imágenes  

  var cVariantesAmz = "";
  var cImagenesAmz = "";
  
  var aNomVar = new Array();
  var aAsinVar = new Array();
  
  var cColorFondo =  document.body.style.backgroundColor;
  var cColorFrente = document.body.style.foregroundColor;    

//var cUrl = "https://www.amazon.com/dp/B0797V1ZWK"; 
//var cUrl = "https://www.amazon.es/dp/B07DDH15JD";

var oItemsDom = "";  // Document Object Model 
var cImagen = ""; // imagen mig src encontrada en cada iteración
var aLinea = []; // Cada ocurrencia de colorImages encontrada es un array
var aResultados = [];
var cSrc = "";
var nContador = 0;
var urlRegex = "/(http?:\/\/[^\s]+)/g";
var cOtra = "^(http[s]?://)?([\\w.-]+)(:[0-9]+)?/([\\w-%]+/)?(dp|gp/product|exec/obidos/asin)/(\\w+/)?(\\w{10})(.*)?$"; 
var cFicAmazon = "";

var cUrlAmazon = "http://www.amazon.es/dp/";



var cCarpetaAmazon = "";
var oTiempo = "";

var parser = Cc["@mozilla.org/xmlextras/domparser;1"].
  createInstance(Ci.nsIDOMParser);  
//var doc = parser.parseFromString(aStr, "text/xml");

var aProductos = new Array();
var cFicAmazon = "amazon-asin.csv";
var cFicPaises = "amzcountries.csv"
var aCodigosAsin = new Array();
var nTotCodigos = 0;
var nElegido = 0;
const XMLHttpRequest = Components.Constructor("@mozilla.org/xmlextras/xmlhttprequest;1");
var oReqHTTP = Components.classes["@mozilla.org/xmlextras/xmlhttprequest;1"]
                  .createInstance(Components.interfaces.nsIXMLHttpRequest);

var nativeJSON = Components.classes["@mozilla.org/dom/json;1"].createInstance(Components.interfaces.nsIJSON);
//var oHttpRequestRefTok = new XMLHttpRequest();

//BuscarVentana("venta9hum");

iimDisplay(cVersion);

cFicAmazon = EligeFicDts(); // Elegimos fichero de ASIN
if (  SiExiste( cFicAmazon )   )
{
    //cBuscar = window.prompt("Teclee el market regional AMAZON donde quiere extraer productos: ","https://www.amazon.es");
    cUrlAmazon = EligeMarket();

    HuboError("Se usará el market " + cUrlAmazon);  
    aCodigosAsin = File2Array( cFicAmazon );
    nTotCodigos =  aCodigosAsin.length;
    HuboError("Se van a procesar un número total de ASINcodes "+nTotCodigos);
    for( nContador = 0; nContador < nTotCodigos ; nContador++ )
   {
    HuboError("Procesado posición ASINcode -> "+nContador+" / "+nTotCodigos);
    HuboError("Procesado código ASINcode -> "+aCodigosAsin[nContador]);
    Proceso(cUrlAmazon + imns.str.trim( aCodigosAsin[nContador] ) );

   }
}   
else
{
 HuboError("No se encuentra el fichero de ASIN codes para explorar");
}


function Proceso(cUrlAmz)
{

var nCuenta = 0;
cFicErr = imns.str.trim(aCodigosAsin[nContador])+ cCarpetaAmazon +"_"+ DameUnico()+".csv";
document.location.href =  cUrlAmz;
//window.location.replace(cUrl);
EsperarCon(3);

//var p = document.createElement("p");
//document.body.appendChild(p);      
//CargaPagina(cUrl);
//var oTimer = window.setTimeout(function(){document.location.href=cUrl} , 5000);   
//document.location.href = cUrl;
//var win = window.open(cUrl, "AMAZON", "menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes");


HuboError("Se está cargando la url "+cUrlAmz);
//Pausar(40000);
//EstoyListo();
//document.location.href = cUrl;
//cFicAmazon = document.location.pathname;

//var oTab = window.open('about:blank', '_blank');

//var oTab = document.defaultView;

//oTab.document.write("pepepepepppppppppp"); // where 'html' is a variable containing your HTML
//tab.document.close(); /

nComienzo =   cUrlAmz.indexOf("amazon.");
nFinal    =   cUrlAmz.indexOf("/dp/");

if (nComienzo > 0)
{ 
    cCarpetaAmazon = cUrlAmz.substring( nComienzo, nFinal );
}

HuboError("@@@@ Preparando nombre fichero "+ cCarpetaAmazon);

cCarpetaAmazon = ReplaceAll(cCarpetaAmazon, "." ,"" );


HuboError("@@@@ Procesando datos para ser grabados en  "+ cCarpetaAmazon);
document = window.content.document; // DOM a inspeccionar
oItemsDom = document.getElementsByTagName("script");
//oItemsDom = document.getElementsByTagName("imageBlock_feature_div");
//oItemsDom = document.querySelectorAll("data");
if( oItemsDom.length > 0 )
 {

  for (nCuenta = 0; nCuenta < oItemsDom.length; nCuenta++)
   {
  
    aLinea = oItemsDom[nCuenta].innerHTML;
    BuscaVariantes(nCuenta);
    BuscaImagenes(nCuenta); 
    

   }
   ExtraeVariantes(); 
 } 
 else
 {
    iimDisplay("**LONGITUD 0***");  
    HuboError("Longitud 0 de la sección script del código HTML.")
 }
/*
 HuboError("antes sin-utf8"+cVariantesAmz);
 HuboError("antes sin-itf8"+cImagenesAmz);

 oVariantesAmz =  utf8_encode(cVariantesAmz);
 oImagenesAmz  =  utf8_encode(cImagenesAmz);

 HuboError("después utf8 "+oVariantesAmz);
 HuboError("después utf8 "+oImagenesAmz);

 oVariantesAmz = JSON.parse( oVariantesAmz );
 oImagenesAmz  = JSON.parse( oImagenesAmz);

 HuboError("JSON -> " + oVariantesAmz);
 HuboError("JSON -> " + oImagenesAmz);
 */

 


HuboError("FINALIZADO - "+cVersion);
}
function Popitas2(title, text)
{ 
  try
  {
    Components.classes['@mozilla.org/alerts-service;1']
              .getService(Components.interfaces.nsIAlertsService)
              .showAlertNotification(null, title, text, false, '', null);
  }
  catch(e)
  {
    // prevents runtime error on platforms that don't implement nsIAlertsService
  }
}
function Popitas3(cTitulo, cTexto)
{

var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator);
var win = wm.getMostRecentWindow("navigator:browser");



var message = cTexto;
var box = win.gBrowser.getNotificationBox();
var notification = box.getNotificationWithValue(cTitulo);
if (notification) {
    notification.label = message;
}
else {
    var buttons = [{
        label: 'Button',
        accessKey: 'B',
        popup: 'blockedPopupOptions',
        callback: null
    }];

    var priority = box.PRIORITY_WARNING_MEDIUM;
    box.appendNotification(message, 'popup-blocked',
                           'chrome://browser/skin/Info.png',
                            priority, buttons);
}
}


function parseUrl1(data) {
var e=/^((http|ftp):\/)?\/?([^:\/\s]+)((\/\w+)*\/)([\w\-\.]+\.[^#?\s]+)(#[\w\-]+)?$/;

if (data.match(e)) {
    return  {url: RegExp['$&'],
            protocol: RegExp.$2,
            host:RegExp.$3,
            path:RegExp.$4,
            file:RegExp.$6,
            hash:RegExp.$7};
}
else {
    return  {url:"", protocol:"",host:"",path:"",file:"",hash:""};
}
}

function parseUrl2(data) {
var e=/((http|ftp):\/)?\/?([^:\/\s]+)((\/\w+)*\/)([\w\-\.]+\.[^#?\s]+)(#[\w\-]+)?/;

if (data.match(e)) {
    return  {url: RegExp['$&'],
            protocol: RegExp.$2,
            host:RegExp.$3,
            path:RegExp.$4,
            file:RegExp.$6,
            hash:RegExp.$7};
}
else {
    return  {url:"", protocol:"",host:"",path:"",file:"",hash:""};
}
}


function isBlank(str)
{
    return (!str || /^\s*$/.test(str));
}

function DetectaBS()
{
var cBS = "";
var cNT ="WINNT";

cBS = "\\";

var cOpSys = Components.classes["@mozilla.org/xre/app-info;1"].getService(Components.interfaces.nsIXULRuntime).OS;
//window.alert(cOpSys);
if (cOpSys != cNT)
    {  cBS  = "/";  }                        
    
return cBS;
}


function DetectaCR()
{
var cCR = "\r\n";
var cNT ="WINNT";

var cOpSys = Components.classes["@mozilla.org/xre/app-info;1"].getService(Components.interfaces.nsIXULRuntime).OS;

if (cOpSys != cNT)
    {  cCR  = "\n";  }                        
    
return cCR;
}

  function getiMacrosFolder(folderName)
    {
       var pname;
       switch (folderName)
       {
          case "Macros" :
             pname = "defsavepath";
             break;
          case "DataSources" :
             pname = "defdatapath";
             break;
          case "Downloads" :
             pname = "defdownpath";
             break;
          case "Logs" :
             pname = "deflogpath";
             break;
          default :
             throw folderName + " is not a valid iMacros folder name";
             break;
       }
       return imns.Pref.getFilePref(pname).path;
}
function CortaNombre(cFullPath)
{
var cFichero = cFullPath.substring( cFullPath.lastIndexOf(cDetBS)+1 );
return cFichero;
}
function EditaFichero(cFichero)
{
//var oFile = imns.FIO.openNode(cViaDts+cDetBS+cFichero);
var oFile = Components.classes["@mozilla.org/file/local;1"].getService(Components.interfaces.nsILocalFile);
oFile.initWithPath(cViaDts+cDetBS+cFichero);
oFile.launch();
}
function Elige( aValores, cTitulo, cTexto)
{
 var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
                        .getService(Components.interfaces.nsIPromptService);
 var lResultado = false;

 var nIndice = {};

 var lResultado = prompts.select(window, cTitulo, cTexto, aValores.length,
				 	 aValores, nIndice);


 if (lResultado == false)
 {
   nIndice = {};
 }

return nIndice.value;
}
function EligeFicDts()
{

var fp = imns.Cc["@mozilla.org/filepicker;1"]
                .createInstance(imns.Ci.nsIFilePicker);
                fp.init(window, "ELIJA FICHERO PRODUCTOS", imns.Ci.nsIFilePicker.modeOpen);

var oFile = imns.FIO.openNode(cViaDts);
var cFichero = "amazon-asin.csv";

     fp.appendFilter("Fichero CSV (*.csv)", "*.csv");
//   fp.appendFilters(imns.Ci.nsIFilePicker.filterAll);
     fp.filterIndex = 0;
     var rootdir = oFile;
     fp.displayDirectory = rootdir;
     var r = fp.show();
     if(r == imns.Ci.nsIFilePicker.returnOK ||
        r == imns.Ci.nsIFilePicker.returnReplace)
        {
          cFichero = fp.file.path;
          cFichero  = CortaNombre(cFichero);
          //window.alert(cFichero);
        }
return cFichero;
}
function Pausar( nMS )
{
 var dFecha = new Date(),
     dAhora = null;
     do { dAhora = new Date(); }

     while ( dAhora - dFecha < nMS );
}
function GrabaFic( cFile, cDatos )
{
 var dTime = new Date();
 var cVia = getiMacrosFolder("Downloads")+DetectaBS()+cFile;
 var oFile = imns.FIO.openNode(cVia);
 return (imns.FIO.appendTextFile( oFile, cDatos+DetectaCR() ) );
}
function GrabaLog( cTexto1 )
{
  GrabaFic ( cFicErr, cTexto1 );
}
function HuboError(cTexto)
{

    var miError = iimGetLastError();
    miError = cTexto + " " + miError;
    iimDisplay(cTexto);
    GrabaLog( cTexto );
    //Popitas3("Aviso:", cTexto);
    
    //document.writeln("<p>"+cTexto+"</p>");

    //window.status = cTexto;
    //document.defaultView.write("<p>"+cTexto+"</p>"); // where 'html' is a variable containing your HTML
    //window.document.write("<p>"+cTexto+"</p>")
}
function ReplaceAll( cTexto, cBusca, cReemplaza )
{

	  while (cTexto.toString().indexOf( cBusca ) != -1)

	    {  cTexto = cTexto.toString().replace( cBusca, cReemplaza ); }

return cTexto;
}
function BajarCanal( cFile, cURL )
{
var oIOService = Cc["@mozilla.org/network/io-service;1"].getService(Ci.nsIIOService)

var oLocalFile = Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsILocalFile);

    oLocalFile.initWithPath(cFile);


if ( cURL.indexOf("http") == -1 )

   { cURL = "https://"+cURL;}


HuboError("BAJARCANAL: Se va a descargar desde -> "+ cURL + " en " +  cFile);

var oDownloadObserver = {onDownloadComplete: function(nsIDownloader, nsresult, oFile) { HuboError(cFile + ' DESCARGADO****')}};

var oDownloader = Cc["@mozilla.org/network/downloader;1"].createInstance();
oDownloader.QueryInterface( Ci.nsIDownloader );
oDownloader.init(oDownloadObserver, oLocalFile);

var oHttpChannel = oIOService.newChannel(  cURL, "", null);
oHttpChannel.QueryInterface( Ci.nsIHttpChannel);
oHttpChannel.asyncOpen(oDownloader, oLocalFile);
}
function CreaSubDir(cCarpeta)
{

var oCarpetaD  = imns.FIO.openNode(getiMacrosFolder("Downloads") );
HuboError("Se va a intentar crear la carpeta "+cCarpeta);
oCarpetaD.append(cCarpeta);
var oResultado = imns.FIO.makeDirectory(oCarpetaD.path);
HuboError("Se ha creado la carpeta "+oResultado);
}
function BuscaVariantes(nContado)
{
    nComienzo = aLinea.indexOf('"colorToAsin":{');
    if( nComienzo >= 1)
    {
        nFinal = aLinea.indexOf('"refactorEnabled":')
        if( nFinal  >= 1)  
                
        cVariantesAmz = aLinea.substring(nComienzo+14, nFinal-1).trim();
        cMensaje = ">>>>> " +"Vuelta nº "+nContado+" "+"/"+oItemsDom.length+" <<<<<"+CRLF;   
        HuboError("***** \\\\Encontradas Variantes AMAZON en la estructura **ASIN2COLOR**");
        HuboError(cVariantesAmz);
        
        
    }   
}
function BuscaImagenes(nContin)
{
    nComienzo = aLinea.indexOf('"colorImages":{');
    if( nComienzo >= 1)
    {
        nFinal = aLinea.indexOf(']}}]},')
        if( nFinal  >= 1)  
                
        cImagenesAmz = aLinea.substring(nComienzo+14, nFinal+5).trim();
        cMensaje = ">>>>> " +"Vuelta nº "+nContin+" "+"/"+oItemsDom.length+" <<<<<"+CRLF;
        HuboError(cMensaje );
        HuboError("***** Aisladas colorImages Variantes-Imágenes AMAZON *********");
        HuboError(cImagenesAmz);
        
        
    } 
 
}
function utf8_encode( cTexto )
{
return  unescape(encodeURIComponent(cTexto)); 
}

/*

colorToAsin:
{
    "Azul Marino-abeto":{"asin":"B0723DMN3X","slate":{}},
    "Moka-gamuza":{"asin":"B072LY84VM","slate":{}},
    "Moka":{"asin":"B077N55Y68","slate":{}},
    "Marrón":{"asin":"B077NB47FJ","slate":{}}
}
*/
function ExtraeVariantes()
{
    
    var aVariantes = [];
    var nTotal = 0;
    var cCadena = "";
    var cAsinCode = "cero";
    var cNumVar = "blanco";
    nContadorVar = 0;
    var cNomCarpetaVariante = "vacio";
//B079566Y9K\"},"Negro Medium":{"asin":"B07955431N"},"Negro Large":{"asin":"B07956H42J"},"Negro Small\":{"asin":"B07956362V"}}-"Negro X-Large 
    cZonaCorte =',"slate":{}}';
    
    //cZonaCorte ='"},"';

   HuboError("*****************Variantes recolectadas: " + cVariantesAmz);
   aVariantes = cVariantesAmz.split(cZonaCorte); 
   HuboError("*****************Variantes separadas: " + aVariantes.join("**"));
   nTotal = aVariantes.length;
   HuboError( "Se cuentan variantes en total "+ nTotal.toString() );
    for(nContadorVar = 0; nContadorVar < nTotal; nContadorVar++)
    {
        HuboError( "RECORRIENDO VARIANTES PARA EXTRAER IMAGENES "+ nContadorVar.toString() );
        cCadena = aVariantes[nContadorVar];
        if (cCadena.trim() == "undefined" ) // Cuidado, hemos superado el indice
        {   HuboError("****Salida de la inspección de Variante desconocida rango superado.");
            break;
        }
        

        if (cCadena.length < 2) // Cuidado, hemos superado el indice que comienza en 0
        {   HuboError("****Salida de la inspección de Variante desconocida por longitud inferior.");
            break;
        }
        
        HuboError( "Variante encontrada en posición "+nContadorVar.toString()+ " longitud "+ aVariantes[nContadorVar].length +""+aVariantes[nContadorVar] );
        nComienzo = cCadena.indexOf('":{"asin":"');
        cAsinCode = cCadena.substring(nComienzo+11);
        cNomVar   = cCadena.substring(0,nComienzo);

        cNomVar = ReplaceAll(cNomVar, '"',"");
        cNomVar = ReplaceAll(cNomVar, '{',"");
        cNomVar = ReplaceAll(cNomVar, ',',"");  // Error en nombre variable
        cAsinCode = ReplaceAll(cAsinCode, "}","");
        cAsinCode = ReplaceAll(cAsinCode, "-","");
        cAsinCode = ReplaceAll(cAsinCode, "{","");
        cAsinCode = ReplaceAll(cAsinCode, '"',"");
        


        //cNomVar = ReplaceAll(cNomVar, "{","")
        HuboError("Creando carpeta para guardar todas las imágenes de la variante " + cNomVar+ " con ASIN "+cAsinCode);
        aNomVar.push(cNomVar);
        HuboError("*+*+* Se ha añadido variante "+ cNomVar+". Total variantes detectadas y almacenadas: " + aNomVar );
        aAsinVar.push(cAsinCode);
        HuboError("*+*+* Se ha añadido asincode "+ cAsinCode+". Total códigos ASIN detectados y almacenados: " + aAsinVar  );

        cNomCarpetaVariante = aCodigosAsin[nContador]+"-"+cAsinCode+"-"+cNomVar+"-"+cCarpetaAmazon ;
        HuboError("+*+*  Nombre de la carpeta a crear: " + cNomCarpetaVariante  );
        HuboError("Extrayendo todas las imágenes de la variante " + cNomVar+" con ASIN "+cAsinCode + " desde " + cCarpetaAmazon );
        ExtraeImagenes(cNomVar,cNomCarpetaVariante); // Se extraen las imágenes de esa variante
        HuboError(">>>>>>>>>>>>>Extraida variante y sus imágenes: " + cNomVar+" con ASIN "+cAsinCode);      
    
        
        
    }
      
}
/*

cVariante+'":[{'  Posición de la variante en colorImages
'"625"]}}],'  Final de cada variante

1variante:

"hiRes":"https://images-na.ssl-images-amazon.com/images/I/81jMCOzOa9L._SL1500_.jpg",
                "variant":"MAIN","main":


                ,"395"],

                ":["291","395"], Principio de variante
                SX695_.jpg":["511","695"],

                main
                pt01
                pt02
                pt03
                pt04
                pt05
                pt06

*/


function ExtraeImagenes(cVariante, cCarpetaImg)
{
    var aImagenesLarge = [];
    var aImagenesHiRes = [];
    var nTotal = 0;
    var cCadena = "";
    
    var cHtmlImagenes = "*";
    HuboError("Se van a separar las imágenes de la variante "+ cVariante);
    // Cortamos la variante a tratar dentro de la estructura colorImages
    //:[{"large":"
    //":[{"large":
    //":[{"large":"
    nComienzo = cImagenesAmz.indexOf(cVariante+'":[{"large":"');
    // Ahora tenemos el final de la variante, sin error...
    //"]}}],"
    nFinal    = cImagenesAmz.indexOf('"]}}]', nComienzo);
    //["420","679"]}}],"
    //":[{"large":"
    HuboError("Aislado html para buscar las imágenes de la variante: "+cVariante);
    HuboError("Cortando html en posición ("+nComienzo+","+nFinal+") "+cVariante);
    // Reutilizamos la variable ya desechada
    cHtmlImagenes = cImagenesAmz.substring(nComienzo, nFinal);
    HuboError("Las imágenes encontradas son: " + cHtmlImagenes );
    aImagenesHiRes =  ProfundidadSieteH(cHtmlImagenes);
    HuboError("PROCESADAS imágenes HiRes: " + aImagenesHiRes );

    aImagenesLarge =  ProfundidadSieteL(cHtmlImagenes);
    HuboError("PROCESADAS imágenes large: " + aImagenesLarge );
    CreaSubDir( cCarpetaImg );
//GrabaHtml( cNombreHtml, cNombreVar, aDatos, cCarpetin)
   
  

   GrabaCsv(aImagenesHiRes, cCarpetaImg, " HiRes ");
   GrabaCsv(aImagenesLarge, cCarpetaImg, " Large ");

   DescargaImg(aImagenesHiRes, cCarpetaImg, "-hrs-",cVariante);
   DescargaImg(aImagenesLarge, cCarpetaImg, "-lrg-",cVariante);
   
  
   GrabaHtml( cCarpetaImg+"-hra.html", cVariante, aImagenesHiRes, cCarpetaImg)
   GrabaHtml( cCarpetaImg+"-lrg.html", cVariante, aImagenesLarge, cCarpetaImg)
   

 
}
function EstoyListo()
{
    document.location.href = cUrl;
     if (window.onLoad)
     { 
        HuboError("Se ha completado la carga " + cUrl);  
        iimDisplay("Se ha completado la carga " + cUrl); 
        window.clearTimeout(oTiempo);        
    
     } 
     else
     {
        HuboError("Esperando a cargar " + cUrl);   
        iimDisplay("Esperando a cargar " + cUrl); 
        
        oTiempo = window.setTimeout('EstoyListo();', 30000)
        // window.setTimeout("scrollMsg()",150);
     }
}

function CargaPagina(cPagina)
{
var   cMacro =  "CODE:";
      cMacro +="VERSION BUILD=8300326 RECORDER=FX"+"\n";
      cMacro +="SET !EXTRACT_TEST_POPUP NO"+"\n";
      cMacro +="SET !ERRORIGNORE YES"+"\n";
      cMacro +="SET !ERRORCONTINUE YES"+"\n";
      cMacro +="SET !REPLAYSPEED FAST"+"\n";
      cMacro +="SET !WAITPAGECOMPLETE YES"+"\n";
      cMacro +="SET !TIMEOUT_STEP 1"+"\n";
      cMacro +="SET !TIMEOUT 1"+"\n";
      cMacro +="SET !TIMEOUT_PAGE 3"+"\n";
      cMacro +="URL GOTO="+cPagina+"\n";
      cMacro +="WAIT SECONDS=1"+"\n";
      iimPlay(cMacro);
      HuboError( 'Se ha cargado '+cPagina );
return cMacro;
}

// Extrae hasta 7 imágenes de una variante hiRes
function ProfundidadSieteH(cImgVariante)
{
    var aImagenes = [];
    var nTotal = 0;
    var cCadena = "";
    var cImagen = "";
    var nPosicion = 0;
    var nContador2 = 0;
    HuboError("Se van a separar las imágenes hiRes por PT01..PT06 "+ cImgVariante);
    // Cortamos la cadena de imágenes hasta en 7 posiciones
    
    
    for(nContador2 = 0; nContador2 < 7; nContador2++)
    {   //,"variant":
        nComienzo = cImgVariante.indexOf('"hiRes":"', nPosicion);
        if (nComienzo > 0)
        {
        // Ahora tenemos el final de la variante, sin error...
        //https://images-na.ssl-images-amazon.com/images/I/81jMCOzOa9L._
        //' "variant":"MAIN","main":'
          nFinal  = cImgVariante.indexOf('.jpg",', nComienzo+9);
          cImagen = cImgVariante.substring(nComienzo+9, nFinal+4);
          
          aImagenes.push(cImagen);
          //HuboError("Añadida imagen: "+aImagenes);
          nPosicion = nFinal+4;
          HuboError("Añadida Imagen hiRes "+ nContador2.toString()+ " "+ cImagen+ " Posicion: "+ cImgVariante.length.toString() +"/"+nPosicion.toString());
        }  
    }
   
   
   return aImagenes;
      
}

// Extrae hasta 7 imágenes Large de una variante 
function ProfundidadSieteL(cImgVariante)
{
    var aImagenes = [];
    var nTotal = 0;
    var cCadena = "";
    var cImagen = "";
    var nPosicion = 0;
    var nContador2 = 0;
    HuboError(cNomVar + " Se van a localizar las imágenes Large en "+ cImgVariante);
    // Cortamos la cadena de imágenes hasta en 7 posiciones
   /*
   "large":"https://images-na.ssl-images-amazon.com/images/I/41Wzi-SPNGL.jpg",
   "thumb":   
   */ 
    
    for(nContador2 = 0; nContador2 < 7; nContador2++)
    {
        nComienzo = cImgVariante.indexOf('"large":"', nPosicion);
        if (nComienzo > 0)
        {
        // Ahora tenemos el final de la variante, sin error...
          nFinal  = cImgVariante.indexOf('","thumb":', nComienzo+9);
          cImagen = cImgVariante.substring(nComienzo+9, nFinal);
          
          aImagenes.push(cImagen);
          //HuboError("Añadida imagen: "+aImagenes);
          nPosicion = nFinal+4;
          HuboError(cNomVar + " Añadida Imagen Large "+ nContador2.toString()+ " "+ cImagen+ " Posicion: "+ cImgVariante.length.toString() +"/"+nPosicion.toString());
        }  
    }
   
   
   return aImagenes;
      
}

function Pausa()
{
//ejecutaScript("window.alert = function alert(message){console.log (message);}");
//        $('#lren').click();
var time = Math.round(Math.random()*10000);
}
function EsperarCon(nSegundos)
{
      //iimDisplay("Esperando ...."+nSegundos.toString() );
      iimSet(  "tiempo", nSegundos ); 
      
      cMacro ="CODE:WAIT SECONDS={{tiempo}}"+"\n";
      iimPlay( cMacro );
      HuboError("** Parada de mantenimiento "+"Esperando ...."+nSegundos.toString() );
}
function FormAppendChild()
{
    var tree = document.getElementById("commands-tree");
    var treechildren = document.getElementById("treechildren");
    var item = document.createElement("treeitem");
    var row = document.createElement("treerow");
    var cell = document.createElement("treecell");
    row.appendChild(cell);
    item.appendChild(row);
    treechildren.appendChild(item);
    return item;
}
function FormAddDom()
{
    var tree = document.getElementById("commands-tree");
    var item = appendChild();
    var index = tree.view.getIndexOfItem(item);
    tree.view.selection.select(index);
    tree.startEditing(index, tree.columns[0]);
}
function ejecutaScript(custom){
    var script = document.createElement('script');
    var code = document.createTextNode('(function() {' + custom + '})();');
    script.appendChild(code);
    (document.body || document.head).appendChild(script);
}
function EligeMarket()
{
  var cInstanciaAmz = "http://www.amazon.es/dp/";
  var aRegional = new Array();
  var nElegido = 0;

    if (  SiExiste( cFicPaises )   )

    {
      aRegional = File2Array( cFicPaises );
      HuboError("Cargados los valores de los Markets Regionales de AMAZON.");
    }
    
    nElegido = Elige( aRegional, cVersion, "Elija la url del market");
    
    if (nElegido > 0 || nElegido == 0 )
      {
    
       cInstanciaAmz = aRegional[nElegido];
    
       //aLinea = s2a(cLinea, ','); //Sólo por espacios
    
       HuboError("Se ha elegido para confeccionar catálogo de imágenes en " + cInstanciaAmz );
    
    
      }
    
    else
      { Popitas3("Debe Elegir un MARKET", "¡¡¡DEBERÍA ELEGIR UNO!!!! "+ nElegido.toString() );}
    


return cInstanciaAmz;
}
function SiExiste( cFichero )
{
  var cExiste = 0;
  var file = new FileUtils.File(getiMacrosFolder("DataSources")+DetectaBS()+cFichero );

   if ( file.exists() == true )
      {
          cExiste = 1;
       }

return cExiste;
}
function DameUnico()
{
    var text = "";
    var possible = "_-0123456789";

    for( var i=0; i < 6; i++ )
        {text += possible.charAt(Math.floor(Math.random() * possible.length));}

    return text;
}
function BuscarVentana(cTexto)
{

    var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator);
    var win = wm.getMostRecentWindow("navigator:browser");
    var box = win.gBrowser.find.find(cTexto);

}
function LeeFic( cFile)
{
 var cVia = getiMacrosFolder("DataSources")+DetectaBS()+cFile;
 var oFile = imns.FIO.openNode(cVia);
 var cTexto = imns.FIO.readTextFile(oFile);
 return cTexto;
}
function File2Array(cFile)
{

var cTexto =  LeeFic( cFile);
var aTexto = [];

//split(/\r?\n/);
 aTexto = cTexto.split("\r\n");
 aTexto =  cTexto.split("\r");
 cTexto.split("\n");
 cTexto.split(/\r?\n/);
 cTexto.match(/[^\r\n]+/g);
 aTexto = cTexto.split(/\r?\n/);
 aTexto = cTexto.split(/\r\n\r\n/);
 aTexto = cTexto.replace(/\r\n/g, "\n").split("\n")
 aTexto = cTexto.match(/[^\r\n]+/g);
return aTexto;
}
function isEmpty(str) {
    return (!str || 0 === str.length);
}
function isBlank(str) {
    return (!str || /^\s*$/.test(str));
}


function GrabaCsv(aDatos, cCarpet, cTitulo)
{
   
     var dTime = new Date();
     HuboError("Grabando datos en carpeta "+cCarpet);
     HuboError("Grabando datos "+aDatos.join("***"));
     var cVia = getiMacrosFolder("Downloads")+DetectaBS()+cCarpet+DetectaBS()+"_"+cCarpetaAmazon+"-variantes.csv";
     var oFile = imns.FIO.openNode(cVia);
     imns.FIO.appendTextFile( oFile, cCarpetaAmazon+cCarpet+DetectaCR()+aDatos.join(DetectaCR()) +DetectaCR() );

}



function DescargaImg(aDatos, cCarpet, cResolucion, cNomVariante)
{

     var dTime = new Date();
     var cLocalImg = ":";
     var nContador3 = 0;
     var nCuantos = aDatos.length;

     HuboError("Bajando imágenes carpeta "+cCarpet);
     HuboError("Las imágenes están en  "+aDatos.join("***"));
     for( nContador3 = 0; nContador3 < nCuantos; nContador3 ++ )
        {
         cLocalImg = getiMacrosFolder("Downloads")+DetectaBS()+cCarpet+DetectaBS()+aCodigosAsin[nContador]+"-"+ cNomVariante  +"-"+cResolucion+"_"+cCarpetaAmazon+ "-"+"-"+"-PT0"+nContador3.toString()+".jpg";
         
         BajarCanal( cLocalImg, aDatos[nContador3] );
        }
    
}


function GrabaHtml( cNombreHtml, cNombreVar, aDatos, cCarpetin)
{

var aEnlaces = new Array();
var nCuentame = 0;
var nLongitud = aDatos.length;
var cLinea = '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" ' ;

var cVia = getiMacrosFolder("Downloads")+DetectaBS()+cCarpetin+DetectaBS()+cNombreHtml ;
var oFile = imns.FIO.openNode(cVia);


HuboError("Grabando fichero en ubicación " + cVia );
HuboError("Grabando fichero " + cNombreHtml );
HuboError("Grabando variante con nombre " + cNombreVar );
HuboError("Grabando en CARPETA " + cCarpetin );
HuboError("Array de datos " + aDatos.join("/") );

aEnlaces.push(cLinea);

cLinea = '"http://www.w3.org/TR/html4/strict.dtd">';
aEnlaces.push(cLinea);

cLinea = '<head>';
aEnlaces.push(cLinea);


cLinea = '<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">';
aEnlaces.push(cLinea);

cLinea = '<meta http-equiv="Content-Style-Type" content="text/css">';
aEnlaces.push(cLinea);

cLinea = '<meta http-equiv="Content-Script-Type" content="text/javascript">';
aEnlaces.push(cLinea);


cLinea = "<title>VARIANTE "+ cNombreVar+" DE PRODUCTO AMAZON " + aCodigosAsin[nContador] + " en " + cUrlAmazon + "</title>";
aEnlaces.push(cLinea);
cLinea = "</head>";
aEnlaces.push(cLinea);


cLinea = '<hr size="3" shade color="red">';
aEnlaces.push(cLinea);
//cNombreVar, aDatos, cCarpetin
cLinea =  "<h3>"+cCarpetin+" AMAZON</h3>";
aEnlaces.push(cLinea);

cLinea = '<hr size="3" shade color="red">';
aEnlaces.push(cLinea);

cLinea =  "<h3>Imágenes disponibles en AMAZON "+ cUrlAmazon +"</h3>";
aEnlaces.push(cLinea);


//cNombreVar, aDatos, cCarpetin

for( nCuentame = 0; nCuentame < nLongitud; nCuentame ++ )
{

    cLinea ='<img src="'+aDatos[nCuentame]+'" alt="ImagenPT0'+nCuentame.toString()+"/"+nLongitud.toString()+'" " style="width:300px;height:300px;border:2;"></img>';
    aEnlaces.push(cLinea);
    HuboError(aDatos[nCuentame]); 
 
}



cLinea = '<hr size="3" shade color="red">';
aEnlaces.push(cLinea);

cLinea = '<hr size="3" shade color="red">';
aEnlaces.push(cLinea);

cLinea = "</body>";
aEnlaces.push(cLinea);
cLinea = "</html>";
aEnlaces.push(cLinea);
HuboError("Grabando datos en html " + cNombreHtml );
HuboError("Contenido html " + aEnlaces.join("***") );
imns.FIO.appendTextFile( oFile, aEnlaces.join(" \n")  );
}