import {Field} from "./field";
import {Feature} from "../element/feature";
import {GeometryType} from "../geometry/geometry";
import {Point} from "../geometry/point";
import {Polyline} from "../geometry/polyline";
import {Polygon} from "../geometry/polygon";

//要素类（要素集合）
//TODO: a lot of things to be done
export class FeatureClass {
    //集合名称
    name: string;
    //别名
    alias: string;
    //描述
    description: string;
    //空间数据类型：点/线/面
    private _type: GeometryType;
    //属性字段集合
    private _fields: Field[] = [];
    //要素集合
    private _features: Feature[] = [];

    get type(): GeometryType {
        return this._type;
    }

    get features(): Feature[] {
        return this._features;
    }

    get fields(): Field[] {
        return this._fields;
    }

    constructor(type: GeometryType) {
        this._type = type;
    }

    //添加要素
    addFeature(feature: Feature) {
        this._features.push(feature);
    }

    //删除要素
    removeFeature(feature: Feature) {
        const index = this._features.findIndex(item => item === feature);
        index != -1 && this._features.splice(index, 1);
    }

    //清空要素集合
    clearFeatures() {
        this._features = [];
    }

    //添加字段
    addField(field: Field) {
        this._fields.push(field);
    }

    //删除字段
    removeField(field: Field) {
        const index = this._fields.findIndex(item => item === field);
        index != -1 && this._fields.splice(index, 1);
    }

    //清空字段集合
    clearFields() {
        this._fields = [];
    }

    //加载GeoJSON数据格式
    //TODO: multiple point line polygon is not supported
    loadGeoJSON(data) {
        Array.isArray(data.features) && data.features.forEach(item => {
            switch (item.geometry.type) {
                case "Point":
                    //TODO: each feature has one type that is ridiculous, cause geojson is a featurecollection, not a featurelayer.
                    this._type = GeometryType.Point;
                    const point = new Point(item.geometry.coordinates[0], item.geometry.coordinates[1]);
                    this._features.push(new Feature(point, item.properties));
                    break;
                case "LineString":
                    this._type = GeometryType.Polyline;
                    const polyline = new Polyline(item.geometry.coordinates);
                    this._features.push(new Feature(polyline, item.properties));
                    break;
                case "Polygon":
                    this._type = GeometryType.Polygon;
                    const polygon = new Polygon(item.geometry.coordinates);
                    this._features.push(new Feature(polygon, item.properties));
                    break;
            }
        });
    }


}