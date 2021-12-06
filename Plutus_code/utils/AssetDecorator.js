/* eslint-disable prettier/prettier */
import React from "react";
import { Button, Text, View } from "react-native";
import axios from 'axios';

class AssetDecorator {
    constructor(assetObj, addShare) {
        this.assetObj = assetObj;
        this.addShare = addShare;
    }

    decorateAsset(){
         const addShareFLT = parseFloat(this.addShare);
         const numShareFLT = parseFloat(this.assetObj.numShare);
         const totalAssetIncrement = addShareFLT + numShareFLT;
         this.assetObj.numShare = totalAssetIncrement;
    }
}

export default AssetDecorator;
