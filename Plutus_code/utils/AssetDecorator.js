class AssetDecorator {
  constructor(assetObj, addShare) {
    this.assetObj = assetObj;
    this.addShare = addShare;
  }

  decorateAsset() {
    const addShareFLT = parseFloat(this.addShare);
    const numShareFLT = parseFloat(this.assetObj.numShare);
    this.assetObj.numShare = addShareFLT + numShareFLT;
  }
}

export default AssetDecorator;
