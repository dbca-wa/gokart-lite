!function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a="function"==typeof require&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n||e)},l,l.exports,e,t,n,r)}return n[o].exports}for(var i="function"==typeof require&&require,o=0;o<r.length;o++)s(r[o]);return s}({1:[function(require,module,exports){"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var gokartProfile={name:"sss",version:"1.0.0",distributionType:"release",description:"Lite Spatial Support System v3",repositoryBranch:"master",lastCommit:"733b31d",commitDate:"Wed Sep 12 13:47:25 2018 +0800",commitMessage:"1. Support multiple top layers, choose one by providing a show method in app configuration file\\n2. Implement layer Refresh feature\\n3. Implement layermetadata control\\n4. Support multiple map widget in one host html page",commitAuthor:"rockychen-dpaw <rocky.chen@dpaw.wa.gov.au>",build:{datetime:"2018-09-12 14:41:00 AWST(+0800)",date:"2018-09-12 AWST(+0800)",time:"14-41-00 AWST(+0800)",platform:"Linux",host:"rockyc-XPS-13-9360",vendorMD5:"cSLGM72NcGY5-obu1jf3QA"}};exports.default=gokartProfile},{}],2:[function(require,module,exports){(function(global){"use strict";function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}var _sssProfile=(require("src/vendor.js"),require("./sss-profile.js")),_gokart=(_interopRequireDefault(_sssProfile),require("../gokart.js")),_gokart2=_interopRequireDefault(_gokart);global.Gokart=_gokart2.default}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"../gokart.js":7,"./sss-profile.js":1,"src/vendor.js":"src/vendor.js"}],3:[function(require,module,exports){"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.getCRS=void 0;var _vendor=require("src/vendor.js"),_CRS_MAP={"EPSG:4326":_vendor.L.CRS.EPSG4326,"EPSG:3857":_vendor.L.CRS.EPSG3857,"EPSG:3395":_vendor.L.CRS.EPSG3395},getCRS=function(crs){if((crs=(crs||"EPSG:4326").toUpperCase())in _CRS_MAP)return _CRS_MAP[crs];throw crs+" is not supported."};exports.getCRS=getCRS},{"src/vendor.js":"src/vendor.js"}],4:[function(require,module,exports){"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.FeatureInfo=void 0;var _vendor=require("src/vendor.js"),FeatureInfo=(require("./layer.js"),function FeatureInfo(map,eventType){if(!map)throw"map is null";this.map=map;this._layer=null,this._eventType=eventType||"click",this._enabled=!1,this._feats=[],this._featsSize=0,this._featIndex=-1,this._popup=null,this._setPopupContent=!0,this._popupOptions=_vendor.$.extend(FeatureInfo.defaultOptions,this.map.gokart.env.featureInfoPopup&&this.map.gokart.env.featureInfoPopup.options?this.map.gokart.env.featureInfoPopup.options:{})});FeatureInfo.defaultOptions={autoPan:!0,closeButton:!0},FeatureInfo.prototype.enable=function(enable){var vm=this;if(this._showFeatureInfo=this._showFeatureInfo||function(ev,tryTimes){var url=null;if(tryTimes=tryTimes||0,vm.map.inMaxBounds(ev.latlng)){var buffer=null;if(0===tryTimes)"polygon"===vm._layer._geometryType?vm._layer._geometryColumn?url=(vm._layer.requireAuth()?vm.map.gokart.env.wfsService:vm.map.gokart.env.publicWfsService)+"/wfs?service=wfs&version=2.0&request=GetFeature&outputFormat=application%2Fjson&typeNames="+vm._layer.getId()+"&cql_filter=CONTAINS("+vm._layer._geometryColumn+",POINT("+ev.latlng.lat+" "+ev.latlng.lng+"))":buffer=vm._layer._featureInfo.buffer||1:buffer=vm._layer._featureInfo.buffer||10;else{if(vm.map.getLMap().getZoom()<vm._layer._featureInfo.tryMinZoom)return;if(!(tryTimes<=vm._layer._featureInfo.tryBuffers.length))return;buffer=vm._layer._featureInfo.tryBuffers[tryTimes-1]}if(!url){var topLeft=vm.map.getLMap().layerPointToLatLng([ev.layerPoint.x-buffer,ev.layerPoint.y-buffer]),bottomRight=vm.map.getLMap().layerPointToLatLng([ev.layerPoint.x+buffer,ev.layerPoint.y+buffer]),bbox="&bbox="+bottomRight.lat+","+topLeft.lng+","+topLeft.lat+","+bottomRight.lng;url=(vm._layer.requireAuth()?vm.map.gokart.env.wfsService:vm.map.gokart.env.publicWfsService)+"/wfs?service=wfs&version=2.0&request=GetFeature&outputFormat=application%2Fjson&typeNames="+vm._layer.getId()+bbox}var currentLayer=vm._layer;_vendor.$.ajax({url:url,dataType:"json",success:function(response,stat,xhr){if(response.totalFeatures<1)return void(vm.map.getLMap().getZoom()>=vm._layer._featureInfo.tryMinZoom&&vm._showFeatureInfo(ev,tryTimes+1));if(currentLayer==vm._layer){var feat=response.features[0];if(void 0===vm._layer._featureInfo.__popupHtmlElement||null===vm._layer._featureInfo.__popupHtmlElement){vm._layer._featureInfo.__properties=[],vm._layer._featureInfo.excluded_properties?_vendor.$.each(feat.properties,function(k,v){if(!vm._layer._featureInfo.excluded_properties.find(function(prop){return prop===k})){var prop=vm._layer._featureInfo.properties.find(function(prop){return prop.name===k});if(prop)vm._layer._featureInfo.__properties.push(prop);else{if(["ogc_fid","md5_rowhash"].indexOf(k.toLowerCase())>=0)return;vm._layer._featureInfo.__properties.push({name:k,title:k.camelize()})}}}):vm._layer._featureInfo.properties?_vendor.$.each(vm._layer._featureInfo.properties,function(index,prop){prop.name in feat.properties&&vm._layer._featureInfo.__properties.push(prop)}):_vendor.$.each(feat.properties,function(k,v){["ogc_fid","md5_rowhash"].indexOf(k.toLowerCase())>=0||vm._layer._featureInfo.__properties.push({name:k,title:k.camelize()})});var get_style=function(element){return vm._layer._featureInfo.infostyle&&vm._layer._featureInfo.infostyle[element]?' style="'+vm._layer._featureInfo.infostyle[element]+'" ':""},msg=null;msg="<div class='gokart_feature_info'><table"+get_style("table")+">",msg+="<tbody"+get_style("tbody")+">",_vendor.$.each(vm._layer._featureInfo.__properties,function(index,prop){prop.name in feat.properties&&(msg+="<tr"+get_style("tbody.tr")+"><th"+get_style("tbody.th")+">"+prop.title+'</th><td id="featureinfo_'+prop.name+'"'+get_style("tbody.td")+"></td></tr>")}),msg+="</tbody>",msg+="<tfoot"+get_style("tfoot")+"><tr id='featureinfo_navigator' class='featureinfo_navigator'"+get_style("tfoot.tr")+"><td colspan='2'"+get_style("tfoot.td")+">",msg+="<img id='featureinfo_navigator_previous' class='featureinfo_navigator_button' src='"+vm.map.gokart.env.gokartService+"/dist/static/images/previous.svg'> <span id='featureinfo_current_index'></span>/<span id='featureinfo_size'></span> <img id='featureinfo_navigator_next' class='featureinfo_navigator_button' src='"+vm.map.gokart.env.gokartService+"/dist/static/images/next.svg'>",msg+="</td></tr></tfoot>",msg+="</table></div>",vm._layer._featureInfo.__popupHtmlElement=(0,_vendor.$)(_vendor.$.parseHTML(msg))}vm._setPopupContent&&(vm._layer._featureInfo.__popupHtmlElement.find("#featureinfo_navigator_previous").on("click",function(ev){ev.stopPropagation(),vm._featIndex<=0?vm.selectFeature(vm._featsSize-1):vm.selectFeature(vm._featIndex-1)}),vm._layer._featureInfo.__popupHtmlElement.find("#featureinfo_navigator_next").on("click",function(ev){ev.stopPropagation(),vm._featIndex>=vm._featsSize?vm.selectFeature(0):vm.selectFeature(vm._featIndex+1)}),vm._popup.setContent(vm._layer._featureInfo.__popupHtmlElement.get(0))),_vendor.$.each(response.features,function(index,feat){if(index>=vm._feats.length&&vm._feats.push({properties:{}}),_vendor.$.each(vm._layer._featureInfo.__properties,function(index2,prop){if(null===feat.properties[prop.name]||void 0===feat.properties[prop.name])vm._feats[index].properties[prop.name]=null;else{var value=feat.properties[prop.name];try{value?"precision"in prop&&(value=parseFloat(value).toFixed(parseInt(prop.precision))):value=""}catch(ex){}vm._feats[index].properties[prop.name]=value}}),vm._layer._featureInfo.highlight&&["polygon","multipolygon"].indexOf(feat.geometry.type.toLowerCase())>=0&&(vm._feats[index].geometry?vm._feats[index].geometry.setLatLngs(_vendor.L.GeoJSON.coordsToLatLngs(feat.geometry.coordinates,2)):vm._feats[index].geometry=_vendor.L.polygon(_vendor.L.GeoJSON.coordsToLatLngs(feat.geometry.coordinates,2),vm._layer._featureInfo.style||{})),"event"===vm._layer._featureInfo.position)vm._feats[index].position=ev.latlng;else{vm._getPosition=vm._getPosition||function(latlngs,position,referenceLatlng){var point=null;return _vendor.$.each(latlngs,function(i,latlng){if(Array.isArray(latlng)&&(latlng=vm._getPosition(latlng,position)),null===point)point=latlng;else if("north"===position)point.lat<latlng.lat&&(point=latlng);else{if("south"!==position)throw"Position '"+position+"' does not support.";point.lat>latlng.lat&&(point=latlng)}}),point},vm._feats[index].position=vm._getPosition(vm._feats[index].geometry.getLatLngs(),"north")||ev.latlng}}),vm._featsSize=response.features.length,vm._featsSize<2?vm._layer._featureInfo.__popupHtmlElement.find("#featureinfo_navigator").hide():vm._layer._featureInfo.__popupHtmlElement.find("#featureinfo_navigator").show(),vm.selectFeature(0)}},error:function(xhr,status,message){vm.warning=!0,alert(xhr.status+" : "+(xhr.responseText||message))},xhrFields:{withCredentials:!0}})}},enable&&!this._enabled){if(!this._layer)throw"Layer is null";this.map.getMapElement().css("cursor","pointer"),this.map.getLMap().on(this._eventType,this._showFeatureInfo),this._enabled=!0}else!enable&&this._enabled&&(this.clear(),this.map.getMapElement().css("cursor",""),this.map.getLMap().off(this._eventType,this._showFeatureInfo),this._enabled=!1)},FeatureInfo.prototype.setLayer=function(layer){if(layer){if(this._layer===layer)return void this.enable(!0);if(this._layer&&(this._layer._featureInfo.__popupHtmlElement&&(this._layer._featureInfo.__popupHtmlElement.find("#featureinfo_navigator_previous").off("click"),this._layer._featureInfo.__popupHtmlElement.find("#featureinfo_navigator_next").off("click")),this.clear()),this._layer=layer,this._layer._featureInfo=this._layer._featureInfo||{},!this._layer._featureInfo.initialized){if(this._layer._featureInfo.initialized=!0,this._layer._featureInfo.cache=this._layer._featureInfo.cache||!1,this._layer._featureInfo.tryMinZoom=parseInt(this._layer._featureInfo.tryMinZoom)||999,this._layer._featureInfo.tryBuffers){Array.isArray(this._layer._featureInfo.tryBuffers)||(this._layer._featureInfo.tryBuffers=[this._layer._featureInfo.tryBuffers]);for(var index=0;index<this._layer._featureInfo.tryBuffers.length;index++)this._layer._featureInfo.tryBuffers[index]=parseInt(this._layer._featureInfo.tryBuffers[index])}else this._layer._featureInfo.tryBuffers=[10];if(this._layer._featureInfo.position=this._layer._featureInfo.position||"event",this._layer._featureInfo.css=this._layer._featureInfo.css||{},this._layer._featureInfo.properties)for(var index=0;index<this._layer._featureInfo.properties.length;index++)"string"==typeof this._layer._featureInfo.properties[index]&&(this._layer._featureInfo.properties[index]={name:this._layer._featureInfo.properties[index],title:this._layer._featureInfo.properties[index].camelize()}),this._layer._featureInfo.properties[index].title||(this._layer._featureInfo.properties[index].title=this._layer._featureInfo.properties[index].name.camelize())}var options=_vendor.$.extend({},this._popupOptions,this._layer._featureInfo.popup_options||{}),vm=this;this._layer._featureInfo.buttons&&(options.buttons=[],this._layer._featureInfo.buttons.indexOf("clear")>=0&&this._layer._featureInfo.cache&&options.buttons.push([vm.map.gokart.env.gokartService+"/dist/static/images/clear.svg",function(ev){ev.stopPropagation(),vm.clear()}])),this._popup=_vendor.L.popup(options),this._setPopupContent=!0,this._feats.length=0,this._featsSize=0,this._featIndex=-1,this.enable(!0)}else this.enable(!1)},FeatureInfo.prototype.clear=function(){this._layer._featureInfo.highlight?(this._featIndex>=0&&this._layer._featureInfo.cache?(this._feats[this._featIndex].geometry.closePopup(),this._feats[this._featIndex].geometry.unbindPopup()):this._popup.isOpen()&&this._popup.remove(),this._featIndex>=0&&this._feats[this._featIndex].geometry.remove()):this._popup.isOpen()&&this._popup.remove(),this._featIndex=-1,this._featsSize=0},FeatureInfo.prototype.selectFeature=function(index){if((index<0||index>=this._featsSize)&&(index=0),this._layer&&this._layer._featureInfo.__popupHtmlElement){var vm=this;_vendor.$.each(this._feats[index].properties,function(k,v){vm._layer._featureInfo.__popupHtmlElement.find("#featureinfo_"+k).text(null===v?"":v)}),this._featsSize>1&&(vm._layer._featureInfo.__popupHtmlElement.find("#featureinfo_size").text(this._featsSize),vm._layer._featureInfo.__popupHtmlElement.find("#featureinfo_current_index").text(index+1)),index===this._featIndex?this._layer._featureInfo.highlight&&this._layer._featureInfo.cache?this._feats[index].geometry.openPopup(this._feats[index].position):(this._popup.setLatLng(this._feats[index].position),this._popup.isOpen()||this._popup.openOn(this.map.getLMap())):(this._layer._featureInfo.highlight?(this._featIndex>=0&&(this._layer._featureInfo.cache&&this._feats[this._featIndex].geometry.unbindPopup(),this._feats[this._featIndex].geometry.remove()),this._feats[index].geometry.addTo(this.map.getLMap()),this._layer._featureInfo.cache?(this._feats[index].geometry.bindPopup(this._popup),this._feats[index].geometry.openPopup(this._feats[index].position)):(this._popup.setLatLng(this._feats[index].position),this._popup.isOpen()||this._popup.openOn(this.map.getLMap()))):(this._popup.setLatLng(this._feats[index].position),this._popup.isOpen()||this._popup.openOn(this.map.getLMap())),this._featIndex=index)}},exports.FeatureInfo=FeatureInfo},{"./layer.js":5,"src/vendor.js":"src/vendor.js"}],5:[function(require,module,exports){"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.Layer=void 0;var _vendor=require("src/vendor.js"),_crs=require("./crs.js"),Layer=function Layer(map,layer){if(this.constructor===Layer)throw"Can't create a instance of a abstract class";var vm=this;_vendor.$.each(layer,function(key,value){vm["_"+key]=value}),this._options=this._options||{},_vendor.$.each(this.defaultOptions,function(key,value){key in vm._options||(vm._options[key]=value)}),this._mapLayer=null,this.map=map,this._featureCount=null,this.addTime=null,this.refreshTime=null,this._baseurl=null};Layer.getLayer=function(map,layer){try{return map.getLayer(layer)}catch(ex){if(layer instanceof Layer)map.regiterLayer(layer);else if(layer.id){var layerid=layer.id;if(layer.serviceType=layer.serviceType||"WMTS","WMS"===layer.serviceType)layer=new WMSTileLayer(map,layer);else{if("WMTS"!==layer.serviceType)throw layer.serviceType?layer.serviceType+" not supported.":"serviceType is not configured for layer '"+layerid+"'.";layer=new TileLayer(map,layer)}map.registerLayer(layer)}return layer}},Layer.loadLayers=function(map){map.gokart.env.cswApp=(map.gokart.env.cswApp||map.gokart.env.app).toLowerCase();var processLayers=function(layers){var zIndex=2,toplayer_zIndex=1e3;_vendor.$.each(map.gokart.env.layers||[],function(index,l){var layer=layers.find(function(o){return o.id===l.id});layer?_vendor.$.extend(layer,l):(layers.push(l),layer=l),layer.options=layer.options||{},"baselayer"===layer.layerType?layer.options.zIndex=1:"toplayer"===layer.layerType?(layer.options.zIndex=toplayer_zIndex,toplayer_zIndex+=1):layer.options.zIndex&&layer.options.zIndex>=300&&layer.options.zIndex<1e3||(layer.options.zIndex=zIndex,zIndex+=1)}),_vendor.$.each(layers,function(index,l){"baselayer"===l.layerType?l.options.opacity=1:"overlayer"===l.layerType?null!==l.options.opacity&&void 0!==l.options.opacity||(l.options.opacity=.5):null!==l.options.opacity&&void 0!==l.options.opacity||(l.options.opacity=.8),l.requireAuth=!l.id.startsWith("public:")});var baselayers={},overlayers={},baselayerCount=0,overlayerCount=0;_vendor.$.each(layers,function(index,l){if(l.requireAuth){if(!map.isAuthenticated())return}else if(map.isAuthenticated()&&l.disable4AuthedUser)return;try{l=Layer.getLayer(map,l)}catch(ex){return console.error(ex),void alert(ex)}l.isBaselayer()?(baselayers[l._title||l._id]=l.getMapLayer(),1===(baselayerCount+=1)&&l.addToMap()):l.isOverlayer()&&(l.addToMap(),overlayers[l._title||l._id]=l.getMapLayer(),overlayerCount+=1)}),map.setToplayer(),(baselayerCount>1||overlayerCount>0)&&_vendor.L.control.layers(baselayerCount>1?baselayers:null,overlayerCount>0?overlayers:null).addTo(map.getLMap())};if(map.isAuthenticated()){var req=new window.XMLHttpRequest;req.withCredentials=!0,req.onload=function(){var layers=[];JSON.parse(this.responseText).forEach(function(l){l.tags.some(function(t){return"basemap"===t.name})?l.layerType="baselayer":l.layerType="overlayer",l.serviceType="WMTS",layers.push(l)}),processLayers(layers)},req.onerror=function(ev){var msg="Couldn't load layer catalogue!"+(req.statusText?" ("+req.statusText+")":"");console.error(msg),alert(msg)},req.open("GET",map.gokart.env.cswService+"?format=json&application__name="+map.gokart.env.cswApp),req.send()}else processLayers([])},Layer.prototype._create=function(){throw"Not implemented"},Layer.prototype.getId=function(){return this._id},Layer.prototype.getMapLayer=function(){return this._mapLayer||(this._create(),this._baseurl=this._mapLayer._url,this._mapLayer.layer=this,this._mapLayer.on("add",function(ev){var layer=this.layer;layer.addTime=new Date,layer.refreshTime=layer.addTime,layer.isBaselayer()?layer.map.baselayer=layer:layer.isToplayer()&&(layer.map.toplayer=layer,layer.map.featureInfo.setLayer(layer),layer.map.featureCountControl&&layer.map.featureCountControl.setLayer(layer),layer.map.layerMetadataControl&&layer.map.layerMetadataControl.setLayer(layer))}),this._mapLayer.on("remove",function(ev){var layer=this.layer;layer.addTime=null,layer.refreshTime=null,layer.isBaselayer()&&layer.map.baselayer===this.layer?layer.map.baselayer=null:layer.isToplayer()&&layer.map.toplayer===this.layer&&(layer.map.featureInfo.setLayer(null),layer.map.featureCountControl&&layer.map.featureCountControl.setLayer(null),layer.map.layerMetadataControl&&layer.map.layerMetadataControl.setLayer(null),layer.map.toplayer=null)})),this._mapLayer},Layer.prototype.refresh=function(){this.isAdded()&&(this.refreshTime=new Date,this._options.revision=(this._options.revision||0)+1,this._mapLayer._url=this._baseurl+"&revision="+this._options.revision,this._mapLayer.redraw(),this.isToplayer()&&(this.map.featureCountControl&&this.map.featureCountControl.showFeatureCount(!0),this.layerMetadataControl&&this.map.layerMetadataControl.setLayer(this,!0)))},Layer.prototype.requireAuth=function(){return this._requireAuth},Layer.prototype.isBaselayer=function(){return"baselayer"===this._layerType},Layer.prototype.isOverlayer=function(){return"overlayer"===this._layerType},Layer.prototype.isToplayer=function(){return"toplayer"===this._layerType},Layer.prototype.isAdded=function(){return!(!this._mapLayer||!this._mapLayer._map)},Layer.prototype.getFeatureCount=function(refresh,successCallback,failedCallback){if(successCallback||(successCallback=function(featurecount){alert(featurecount)}),failedCallback||(failedCallback=function(msg){alert(msg)}),refresh||null===this._featureCount){var vm=this,url=(this.requireAuth()?this.map.gokart.env.wfsService:this.map.gokart.env.publicWfsService)+"/wfs?service=wfs&version=1.1.0&request=GetFeature&typeNames="+this.getId()+"&resultType=hits";_vendor.$.ajax({url:url,dataType:"xml",success:function(response,stat,xhr){try{var previousFeaturecount=void 0===vm._featureCount?null:vm._featureCount;vm._featureCount=parseInt(response.firstChild.getAttribute("numberOfFeatures")),successCallback(vm._featureCount,previousFeaturecount)}catch(msg){failedCallback(msg)}},error:function(xhr,status,message){failedCallback(xhr.status+" : "+(xhr.responseText||message))},xhrFields:{withCredentials:!0}})}else successCallback(this._featureCount)},Layer.prototype.addToMap=function(add){if(void 0===add&&(add=!0),add){if(this.isAdded())return;this._mapLayer||this.getMapLayer(),this.isBaselayer()&&this.map.baselayer?this.map.baselayer.addToMap(!1):this.isToplayer()&&this.map.toplayer&&this.map.toplayer.addToMap(!1),this._mapLayer.addTo(this.map.getLMap())}else this.isAdded()&&this._mapLayer.remove()};var WMSTileLayer=function(map,layer){Layer.call(this,map,layer),"crs"in this._options&&"string"==typeof this._options.crs&&(this._options.crs=(0,_crs.getCRS)(this._options.crs)),this._options.layers=this._id};WMSTileLayer.prototype=Object.create(Layer.prototype),WMSTileLayer.prototype.constructor=WMSTileLayer,WMSTileLayer.prototype.defaultOptions={crossOrigin:!0,styles:"",format:"image/png",transparent:!0,version:"1.1.1",crs:_vendor.L.CRS.EPSG4326,tileSize:256,opacity:1,updateWhenIdle:!0,updateWhenZooming:!0,updateInterval:200,keepBuffer:4},WMSTileLayer.prototype._create=function(){this._mapLayer||(this._mapLayer=_vendor.L.tileLayer.wms(this.requireAuth()?this.map.gokart.env.wmsService:this.map.gokart.env.publicWmsService,this._options))};var TileLayer=function(map,layer){Layer.call(this,map,layer),this._tileUrl=(this.requireAuth()?this.map.gokart.env.wmtsService:this.map.gokart.env.publicWmtsService)+"?layer="+this._id+"&style="+this._options.style+"&tilematrixset="+this._options.tilematrixset+"&Service=WMTS&Request=GetTile&Version=1.0.0&Format="+this._options.format+"&TileMatrix="+this._options.tilematrixset+":{z}&TileCol={x}&TileRow={y}"};TileLayer.prototype=Object.create(Layer.prototype),TileLayer.prototype.constructor=TileLayer,TileLayer.prototype.defaultOptions={crossOrigin:!0,style:"",tilematrixset:"gda94",format:"image/png",Version:"1.0.0",transparent:!0,version:"1.1.1",opacity:1,tileSize:1024},TileLayer.prototype._create=function(){this._mapLayer||(this._mapLayer=_vendor.L.tileLayer(this._tileUrl,this._options))},exports.Layer=Layer},{"./crs.js":3,"src/vendor.js":"src/vendor.js"}],6:[function(require,module,exports){"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var _vendor=require("src/vendor.js"),_layer=require("./layer.js"),_crs=require("./crs.js"),_featureinfo=require("./featureinfo.js"),Map=function(gokart){this.gokart=gokart,this._mapid=gokart.env.mapid,this._mapElement=(0,_vendor.$)("#"+this._mapid),this._options=this.gokart.env.map||{},"crs"in this._options&&"string"==typeof this._options.crs&&(this._options.crs=(0,_crs.getCRS)(this._options.crs));var vm=this;_vendor.$.each(["bounds","maxBounds"],function(index,key){key in vm._options&&Array.isArray(vm._options[key])&&(vm._options[key]=_vendor.L.latLngBounds(_vendor.L.latLng(vm._options[key][0][0],vm._options[key][0][1]),_vendor.L.latLng(vm._options[key][1][0],vm._options[key][1][1])))}),this._map=null,this.layers={},this.baselayer=null,this.toplayer=null,this.toplayers=[],this._setToplayerTaskRunTime=null,this._setToplayerTask=null,this._create()};Map.prototype.setOption=function(key,value,enforce){if("crs"===key&&"string"==typeof value)value=(0,_crs.getCRS)(value);else if("maxBounds"===key&&Array.isArray(value))value=_vendor.L.latLngBounds(_vendor.L.latLng(value[0],_vendor.L.latLng(value[1])));else if("fullpageControl"===key){if(!this.gokart.embeded)return}else if(!enforce&&this._options[key]===value)return;this._options[key]=value,this._map&&("center"===key?this._map.setView(value):"zoom"===key?this._map.setZoom(value):"zoomControl"===key?value?(this.zoomControl||(this.zoomControl=_vendor.L.control.zoom(_vendor.$.extend({position:"topleft"},this.gokart.env.zoomControl&&this.gokart.env.zoomControl.options?this.gokart.env.zoomControl.options:{}))),this.zoomControl._map||this.zoomControl.addTo(this._map)):this.zoomControl&&this.zoomControl._map&&this.zoomControl.remove():"attributionControl"===key?value?(this.attributionControl||(this.attributionControl=_vendor.L.control.attribution(_vendor.$.extend({position:"bottomright"},this.gokart.env.attributionControl&&this.gokart.env.attributionControl.options?this.gokart.env.attributionControl.options:{}))),this.attributionControl._map||this.attributionControl.addTo(this._map)):this.attributionControl&&this.attributionControl._map&&this.attributionControl.remove():"scaleControl"===key?value?(this.scaleControl||(this.scaleControl=_vendor.L.control.scale(_vendor.$.extend({position:"bottomleft"},this.gokart.env.scaleControl&&this.gokart.env.scaleControl.options?this.gokart.env.scaleControl.options:{}))),this.scaleControl._map||this.scaleControl.addTo(this._map)):this.scaleControl&&this.scaleControl._map&&this.scaleControl.remove():"fullpageControl"===key?value?(this.fullpageControl||(this.fullpageControl=_vendor.L.control.fullpage(this)),this.fullpageControl._map||this.fullpageControl.addTo(this._map)):this.fullpageControl&&this.fullpageControl._map&&this.fullpageControl.remove():"featureCountControl"===key?value?(this.featureCountControl||(this.featureCountControl=_vendor.L.control.featureCount(this)),this.featureCountControl._map||this.featureCountControl.addTo(this._map)):this.featureCountControl&&this.featureCountControl._map&&this.featureCountControl.remove():"layerMetadataControl"===key&&(value?(this.layerMetadataControl||(this.layerMetadataControl=_vendor.L.control.layerMetadata(this)),this.layerMetadataControl._map||this.layerMetadataControl.addTo(this._map)):this.layerMetadataControl&&this.layerMetadataControl._map&&this.layerMetadataControl.remove()))},Map.prototype.getLMap=function(){return this._map},Map.prototype.getMapElement=function(){return this._mapElement},Map.prototype.inMaxBounds=function(latlng){return!this._options.maxBounds||this._options.maxBounds.contains(latlng)},Map.prototype.setSize=function(width,height){this._map.setSize(width,height)},Map.prototype.setToplayer=function(layerid,action){if(0!==this.toplayers.length){var layer=null;if(null===layerid||void 0===layerid)layer=null;else if(layerid instanceof _layer.Layer){if(layer=this.getLayer(layerid),!layer.isToplayer())throw"Layer '"+layer._id+"' is not a top layer."}else if("number"==typeof layerid)try{if(!(layer=this.toplayers[layerid]))throw layerid+" is out of index"}catch(ex){layer=null}else if(_vendor.$.each(this.toplayers,function(index,l){if(l._id===layerid)return layer=l,!1}),null===layer)throw"Layer '"+layerid+"' is not a top layer.";if(null===layer?(layerid=0,layer=this.toplayers[layerid],action="auto"):null!==action&&void 0!==action||(action="add"),null!==this._setToplayerTask&&void 0!==this._setToplayerTask){try{clearTimeout(this._setToplayerTask)}catch(ex){}this._setToplayerTask=null,this._setToplayerTaskRunTime=null}var vm=this;"add"===action?layer.addToMap():"refresh"===action?layer.isAdded()?layer.refresh():layer.addToMap():"auto"===action&&(layer._show?layer._show.call(layer,function(action,nextRunDatetime){if("add"===action)layer.addToMap();else if("refresh"===action)layer.isAdded()?layer.refresh():layer.addToMap();else if("update"===action)layer.isAdded()?(layer.map.featureInfo.clear(),layer.refresh()):layer.addToMap();else if(layerid===vm.toplayers.length-1&&null===vm.toplayer)layer.addToMap();else if("wait"!==action)return null===action?void vm.setToplayer(layerid+1,"auto"):void alert("The show action '"+action+"' Not Support");nextRunDatetime&&(vm._setToplayerTaskRunTime=nextRunDatetime,vm._setToplayerTask=setTimeout(function(){vm._setToplayerTask=null,vm._setToplayerTaskRunTime=null,vm.setToplayer()},nextRunDatetime-new Date))}):null===vm.toplayer&&layer.addToMap())}},Map.prototype.getLayer=function(layer){if("string"==typeof layer){if(layer in this.layers)return this.layers[layer];throw"The layer '"+layer+"' is not found"}if(layer instanceof _layer.Layer){if(layer._id in this.layers)return this.layers[layer._id];throw"The layer '"+layer._id+"' is not registered"}if(layer.id){if(layer.id in this.layers)return this.layers[layer.id];throw"The layer '"+layer._id+"' is created"}},Map.prototype.registerLayer=function(layer){if(!(layer instanceof _layer.Layer))throw"The parameter 'layer' should be a Layer instance.";if(this.layers[layer._id])throw"The layer '"+layer._id+"' already exist.";this.layers[layer._id]=layer,layer.isToplayer()&&this.toplayers.push(layer)},Map.prototype.isAuthenticated=function(){return this.gokart.isAuthenticated()},Map.prototype.getOption=function(name){return this._options[name]},Map.prototype._create=function(){if(!this._map){this._map=_vendor.L.map(this._mapid,_vendor.$.extend({},this._options,{zoomControl:!1,attributionControl:!1,scaleControl:!1,fullpageControl:!1})),this._options.bounds&&this._map.fitBounds(this._options.bounds);var vm=this;_vendor.$.each(["zoomControl","attributionControl","scaleControl","fullpageControl","featureCountControl","layerMetadataControl"],function(index,key){vm.setOption(key,vm._options[key]||!1,!0)}),this.featureInfo=new _featureinfo.FeatureInfo(this),_layer.Layer.loadLayers(this)}},exports.default=Map},{"./crs.js":3,"./featureinfo.js":4,"./layer.js":5,"src/vendor.js":"src/vendor.js"}],7:[function(require,module,exports){"use strict";function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}Object.defineProperty(exports,"__esModule",{value:!0});var _map=require("./components/map.js"),_map2=_interopRequireDefault(_map),_crs=require("./components/crs.js"),_layer=require("./components/layer.js"),_vendor=require("src/vendor.js"),Gokart=function Gokart(app,mapid,embeded){if(this.env=eval(app+"Env"),"undefined"!=typeof gokartOptions)if(Array.isArray(gokartOptions)){var options=gokartOptions.find(function(o){return o.app===app});options&&(this.env=_vendor.utils.extend(this.env,options))}else gokartOptions.app===app?this.env=_vendor.utils.extend(this.env,gokartOptions):"app"in gokartOptions||(this.env=_vendor.utils.extend(this.env,gokartOptions));this.env.app=app,this.env.mapid=mapid,this.embeded=!!embeded;var vm=this;$.each([["publicWmtsService","wmtsService"],["publicWmsService","wmsService"],["publicWfsService","wfsService"]],function(index,config){vm.env[config[0]]||(vm.env[config[0]]=vm.env[config[1]])}),$.ajax({url:this.env.whoamiUrl,method:"GET",dataType:"json",success:function(response,stat,xhr){vm.user=response,vm.user.authenticated=!!vm.user.session_key,vm.map=new Gokart.Map(vm)},error:function(xhr,status,message){vm.user={authenticated:!1},vm.map=new Gokart.Map(vm)},xhrFields:{withCredentials:!0}})};Gokart.prototype.isAuthenticated=function(){return!(!this.user||!this.user.authenticated)},Gokart.Map=_map2.default,Gokart.Layer=_layer.Layer,Gokart.getCRS=_crs.getCRS,Gokart.utils=_vendor.utils,exports.default=Gokart},{"./components/crs.js":3,"./components/layer.js":5,"./components/map.js":6,"src/vendor.js":"src/vendor.js"}]},{},[2]);
