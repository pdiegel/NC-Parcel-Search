export const fieldAliases = {
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

export const countyGISMap = {
  Wake: "https://maps.raleighnc.gov/iMAPS/?pin={parno}",
  Guilford: "https://gisdv.guilfordcountync.gov/Guilford/",
  Johnston:
    "https://mapclick6.johnstonnc.com/mapclick6/index.html/?app=mapclick&ui=mapclick4",
  Ashe: "https://gis.ashecountygov.com/maps/default.htm",
  Lee: "https://lee-arcgis.leecountync.gov/parcelmap/",
  Harnett: "https://gis.harnett.org/gisviewer/",
  Bladen: "https://gis.bladenco.org/",
  Randolph: "https://gis.randolphcountync.gov/randolphts/",
  Hertford:
    "https://hertfordcountync.maps.arcgis.com/apps/instant/sidebar/index.html?appid=26b28f8a51164fc89431eedd61072339",
  Surry: "http://www.gis.surryinfo.net/maps/default.htm",
  Hoke: "https://maps.hokecounty.org/maps/",
  Durham: "https://maps.durhamnc.gov/?pid={altparno}",
  Robeson: "https://maps.roktech.net/ROKMAPS_Robeson/",
  // Add more county GIS links here,
};
