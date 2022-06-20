module.exports = (temp,product)=>{
    let output = temp.replace(/{%PRODUCT%}/g,product.productName);
    output =  output.replace(/{%IMAGE%}/g,product.image);
    output =  output.replace(/{%ID%}/g,product.id);
    output =  output.replace(/{%PRODUCTNAME%}/g,product.productName);
    output =  output.replace(/{$DESCRIPTION$}/g,product.description);
    return output;
}