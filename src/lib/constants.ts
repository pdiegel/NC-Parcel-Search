export const BASE_URL: string =
  "/api/ncparcels/secure/rest/services/NC1Map_Parcels/MapServer/1/query";
export const METADATA_URL: string =
  "/api/ncparcels/secure/rest/services/NC1Map_Parcels/MapServer/1?f=json";
export const CENTROID_URL: string =
  "/api/ncparcels/secure/rest/services/NC1Map_Parcels/MapServer/0/query";
export const DEFAULT_ZOOM: number = 14;
export const MAX_ZOOM: number = 19;
export const STARTING_COORDINATES: [number, number] = [35.7796, -78.6382];
export const LABEL_FONT_SIZE: number = 18; // Font size for the label in pixels
export const PARCEL_FIELDS: string[] = [
  "objectid", // Used for internal filtering
  "parno",
  "altparno",
  "ownname",
  "cntyname", // County Name
  "legdecfull",
  "recareano", // Acreage (Record) as a decimal
  "gisacres", // Acreage (GIS) as a decimal
  "revdatetx", // Date of Last Revision (formatted as a string)
  "revisedate",
  "saledatetx", // Sale Date (formatted as a string)
  "saledate",
  "mapref", // Plat Book/Page
  "sourceref", // Deed Book/Page
  "stcntyfips",
  "parusedesc", // Parcel Use Description
  "siteadd", // Site Address (formatted as a string)
  /* the following fields are used to piece together the site address */
  "saddpref", // Site Address Prefix
  "saddno", // Site Address Number
  "saddstr", // Site Address Street Name
  "saddsttyp", // Site Address Street Type
  "saddstsuf", // Site Address Street Suffix
];
export const PARCEL_OUTFIELDS: string = PARCEL_FIELDS.join(",");

export const COUNTY_GIS_MAP = {
  Wake: "https://maps.raleighnc.gov/iMAPS/?pin={parno}",
  Guilford: "https://gisdv.guilfordcountync.gov/Guilford/",
  Johnston:
    "https://mapclick6.johnstonnc.com/mapclick6/index.html/?app=mapclick&ui=mapclick4",
  Ashe: "https://gis.ashecountygov.com/maps/default.htm",
  Lee: "https://lee-arcgis.leecountync.gov/parcelmap/",
  Harnett: "https://gis.harnett.org/gisviewer/",
  Bladen: "https://gis.bladenco.org/",
  Randolph: "https://gis.randolphcountync.gov/randolphts/?pin={parno}",
  Hertford:
    "https://hertfordcountync.maps.arcgis.com/apps/instant/sidebar/index.html?appid=26b28f8a51164fc89431eedd61072339",
  Surry: "http://www.gis.surryinfo.net/maps/default.htm",
  Hoke: "https://maps.hokecounty.org/maps/",
  Durham: "https://maps.durhamnc.gov/?pid={altparno}",
  Robeson: "https://maps.roktech.net/ROKMAPS_Robeson/",
  Watauga: "https://tax.watgov.org/WataugaNC/maps/map.aspx?pin={altparno}",
  Madison:
    "https://www.arcgis.com/home/webmap/viewer.html?webmap=722c65a3ad3b4c81bc72e4402012b25a",
  Alleghany:
    "https://www.webgis.net/nc/Alleghany/?op=id&id=1|parcels|pin|{parno}",
  Nash: "https://gis.nashcountync.gov/mapviewer/?PARID={parno}",
  Chatham: "https://gisservices.chathamcountync.gov/landinformation/",
  Dare: "https://property.spatialest.com/nc/dare/#/map/search/?term={altparno}",
  Franklin: "https://maps.roktech.net/franklin_GM4/",
  Wayne:
    "https://experience.arcgis.com/experience/ecbb6edfbe18416cbfe76f5876470202/",
  Moore: "https://gis.moorecountync.gov/maps/interactive.htm?PARID={altparno}",
  Catawba: "https://gis.catawbacountync.gov/parcel/?pinc={parno}",
  Wilson: "https://gis.wilson-co.com/maps/?ParcelNumber={parno}",
  Pitt: "https://gis.pittcountync.gov/opis/",
  Sampson:
    "https://www.arcgis.com/apps/webappviewer/index.html?id=eda58e00176642daac341dc621ae3519&query=1828e8cace1-layer-56%2CGEO_PIN%2C{parno}",
  Alamance:
    "https://apps.alamance-nc.com/CountyGISMap/default.aspx?GPIN={parno}",
  Edgecombe:
    "https://gis.edgecombecountync.gov/maps/default.htm?PIN={altparno}",
  Granville:
    "https://granvillecounty.maps.arcgis.com/apps/webappviewer/index.html?id=537f4daef87e42538ffc4d6de338a7a1",
  Chowan:
    "https://www.arcgis.com/apps/webappviewer/index.html?id=dc1c3a48141744c1a123bcad4e5cef50&query=Chowan_Feature_Service_6326%2CPIN%2C{parno}",
  Brunswick:
    "https://www.arcgis.com/apps/webappviewer/index.html?id=6df283e1aa634006baeedf6daac40d38&query=DataViewer_V2_1742_50%2CParcelNumber%2C{parno}",
  Carteret: "https://arcgisweb.carteretcountync.gov/maps/",
  Orange: "https://gis.orangecountync.gov/OrangeNCGIS/Default.htm?PIN={parno}",
  // Add more county GIS links here,
};

export const PARCEL_FIELD_ALIASES = {
  parno: "Parcel Number (PIN)",
  ownname: "Owner Name",
  parval: "Parcel Value",
  siteadd: "Full Site Address",
  gisacres: "GIS Acres",
  saledate: "Last Sale Date",
  saledatetx: "Last Sale Date Text",
  legdecfull: "Full Legal Description",
  revisedate: "Revised Date",
  sourceref: "Source Document Reference",
  subdivisio: "Subdivision Name",
  nparno: "National Parcel Number",
  cntyname: "County Name",
  ownfrst: "Owner First Name",
  ownlast: "Owner Last Name",
  structno: "Number of Structures",
  structyear: "Structure Year",
  ownname2: "Full Second Owner Name",
};
