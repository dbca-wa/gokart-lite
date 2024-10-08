//the config setings for indicative burning program
var ibpEnv = {
    title: "Indicative Burning Program",
    whoamiUrl: "/sso/profile",
    gokartService: "https://ssslite-dev.dbca.wa.gov.au",
    cswService: "https://csw.dbca.wa.gov.au/catalogue/api/records/",
    wmtsService: "https://kmi.dbca.wa.gov.au/geoserver/gwc/service/wmts",
    wmsService: "https://kmi.dbca.wa.gov.au/geoserver/wms",
    wfsService: "https://kmi.dbca.wa.gov.au/geoserver/wfs",
    publicWmtsService: "https://kmi.dbca.wa.gov.au/geoserver/public/gwc/service/wmts",
    app: "ibp",
    cswApp: "ibp",
    map: {
        crs:"EPSG:4326",
        center:[-31.95296,115.86067 ],
        minZoom:2,
        maxZoom:17,
        maxBounds:[[-36,112.6],[-13,129.1]],
        bounds:[[-36,112.6],[-13,129.1]],

        zoomControl:true,
        attributionControl:false,
        scaleControl:false,
        fullpageControl:false,
        featureCountControl:false,

        zoomSnap:1,
        zoomDelta:1,
        traceResize:true,
        boxZoom:true,
        doubleClickZoom:true,
        dragging:true,

        zoomAnimation:true,
        zoomAnimationThreshold:4,
        fadeAnimation:true,
        markerZoomAnimation:true,

        keyboard:true,
        keyboardPanDelta:80
    },

    //layerType: three types: baselayer, overlayer,toplayer
    //base layer always has zindex 1, only one base layer can be shown on map
    //overlayer are layers between base layer and top layer
    //  all overlayers loaded from csw but not configured in environment file have zindex 2
    //  all overlayers cofigured in environment but without configured a correct zindex will receive a zindex from 3 to 100, based on configure order.
    //  all overlayers configure in enviromment with a valid zindex between 100 to 1000, will receive the configured zindex
    //toplayer are layers on the top, always has zindex 1000, only one top layer can be shown on map, user can click on the map to get the detail information of the related feature
    layers:[{
        id:"public:mapbox-streets",
        serviceType:"WMTS",
        layerType:"baselayer",
        options:{
            format:'image/jpeg'
        }
    },{
        id:"public:latest_indicative_burn_program2",
        type:"WMTS",
        layerType:"toplayer",
        geometryType:"polygon",
        geometryColumn:"shape",
        options:{
            style:"public:latest_indicative_burn_program2_ShowPinpoint"
        },
        featureInfo:{
            highlight:true,
            buttons:["clear"],
            tryMinZoom:6,
            tryBuffers:10,
            //used in the first time to fetch the features, default is 1 for polygon ,10 for others
            buffer:1,
            style:{
                stroke:true,
                color:"#ff0000",
                weight:3,
                opacity:1,
                fill:true,
                fillColor:"ff0000",
                fillOpacity:0.3
            },
            properties: ["burnid","region","district","location","purpose_1",{name:"area_ha",precision:0},{name:"perim_km",precision:0}]
        }
    }],
    //configuration for feature info popup
    featureInfoPopup:{
        options:{
        }
    },
    fullpageControl: {
        options:{
        }
    },
    featureCountControl: {
      options: {
          html:"<div style='color:#2a044e;font-weight:bold;font-size:18px'>Total Burn Options : <span id='total_count'></span> </div>",
          featurecount :[
              ["total_count",null]
          ]
      }
    }
};
