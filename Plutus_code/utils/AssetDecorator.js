/* eslint-disable prettier/prettier */
//THIS IS AN EXAMPLE OF DECORATOR PATTERN
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
