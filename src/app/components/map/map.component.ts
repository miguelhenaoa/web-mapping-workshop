import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Map from '@arcgis/core/Map';
import PopupTemplate from '@arcgis/core/PopupTemplate';
import GeoJSONLayer from '@arcgis/core/layers/GeoJSONLayer';
import SimpleRenderer from '@arcgis/core/renderers/SimpleRenderer';
import PictureMarkerSymbol from '@arcgis/core/symbols/PictureMarkerSymbol';
import MapView from '@arcgis/core/views/MapView';
import BasemapGallery from '@arcgis/core/widgets/BasemapGallery';
import Expand from '@arcgis/core/widgets/Expand';
import Home from '@arcgis/core/widgets/Home';
import LayerList from '@arcgis/core/widgets/LayerList';
import Search from '@arcgis/core/widgets/Search';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css',
})
export class MapComponent implements OnInit {
  map: Map = new Map({ basemap: 'streets' });
  view!: MapView;

  constructor() {}

  ngOnInit(): void {
    this.initMap();
  }

  initMap(): void {
    // Initialize MapView and return an instance of MapView
    this.view = new MapView({
      container: 'map',
      map: this.map,
      zoom: 4,
      center: [-98, 35],
    });

    // Widgets
    this.addWidgets();

    // Layers
    this.addCBTWLayer()
  }

  addWidgets(): void {
    const search = new Search({
      view: this.view,
    });

    const home = new Home({
      view: this.view,
    });

    const basemapGallery = new BasemapGallery({
      view: this.view,
    });

    const bgExpand = new Expand({
      view: this.view,
      content: basemapGallery,
      icon: 'esri-icon-basemap',
    });

    const layerList = new LayerList({
      view: this.view,
    });

    const llExpand = new Expand({
      view: this.view,
      content: layerList,
    });

    this.view.ui.add(search, 'top-right');
    this.view.ui.move('zoom', 'top-right');
    this.view.ui.add(home, 'top-right');
    this.view.ui.add(bgExpand, 'top-right');
    this.view.ui.add(llExpand, 'top-right');
  }

  addCBTWLayer(): void {
    const layer = new GeoJSONLayer({
      title: 'CBTW Locations',
      url: 'https://raw.githubusercontent.com/miguelhenaoa/web-mapping-workshop/main/src/assets/cbtw-locations.json',
      popupEnabled: true,
      popupTemplate: new PopupTemplate({
        title: '{address}, {city}',
        content: [
          {
            type: 'fields',
            fieldInfos: [
              {
                fieldName: 'address',
                label: 'Address',
              },
              {
                fieldName: 'city',
                label: 'City',
              },
              {
                fieldName: 'country',
                label: 'Country',
              },
            ],
          },
        ],
      }),
      renderer: new SimpleRenderer({
        symbol: new PictureMarkerSymbol({
          url: 'assets/location.png',
          width: '50px',
          height: '50px',
        }),
      }),
    });

    this.map.add(layer);
  }
}
