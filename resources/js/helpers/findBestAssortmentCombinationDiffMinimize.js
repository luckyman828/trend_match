export default (assortments, desiredSizeSplit, desiredSize, precision, iterations) => {
   
    const maxSize = precision ? parseInt(desiredSize) + precision : parseInt(desiredSize)
     if (!assortments || !desiredSizeSplit) return

    // Generate the base combo
    const baseCombo = {}
    for (const assortment of assortments) {
        baseCombo[assortment.name] = 0
    }

    const combo = baseCombo
    let comboSize = 0
    let comboBoxCount = 0
    let comboDiff = 0

    // Generate a base sizesplit
    const baseSizeSplit = {}
    desiredSizeSplit.map(sizeQuantity => {
        baseSizeSplit[sizeQuantity.name] = 0
    })

    const comboSizeSplit = JSON.parse(JSON.stringify(baseSizeSplit))   
     // order max to test fisrt
   assortments.sort(function(a, b){return b.box_size-a.box_size}); 
    
    let  bestMatch= { diff: 99999,diffsize: 99999, assortment: null,box_size:0 };
    comboSize=desiredSize;
    for (let i = 0; i < assortments.length; i++) {
        const  assortment=assortments[i];
        const  max= Math.floor(desiredSize/assortment.box_size);
         
        const  min=max-3;
         if (min<0) min=0;
         //run from max share to other max 2
         for(let j=max;j>min;j--)
         {
            const  combs = combinations([max-j,max-j+1], assortments.length);
            for (let k = 0; k < combs.length; k++) {        
                let total_test=0;
                combs[k][i]=j;
                for(let n=0;n<assortments.length;n++)
                {
                    if(combs[k][n]!=0)
                    total_test+=assortments[n].box_size * combs[k][n];
                }
                if(total_test>=comboSize && total_test<maxSize)
                {
                    const testComboSizeSplit = JSON.parse(JSON.stringify(comboSizeSplit))
                    // get combinations assortments box_size  array ex [0,0,0,1,2,0] 
                    const  comb=combs[k];
                    for (let m = 0; m< comb.length; m++) {
                        if(comb[m]>0)
                        {
                                for (const assortmentSize of assortments[m].sizeQuantities) {
                                    if (testComboSizeSplit[assortmentSize.size] != null) {
                                        testComboSizeSplit[assortmentSize.size] += parseInt(assortmentSize.quantity)*comb[m];
                                    } else {
                                        testComboSizeSplit[assortmentSize.size] = parseInt(assortmentSize.quantity)*comb[m];
                                    }
                                }          
                        }
                    } 
                     let diff = 0     
                     for (const sizeName of Object.keys(testComboSizeSplit)) {
                         const matchingSize = desiredSizeSplit.find(x => x.name == sizeName)
                         const desiredQuantity = matchingSize ? matchingSize.qty : 0
                         diff += Math.abs(testComboSizeSplit[sizeName] - desiredQuantity)
                     }
                     const  diffsize=total_test-desiredSize;
                     const  box_size=assortment.box_size;
                     if (!bestMatch || (bestMatch.diffsize >= diffsize  )) {
                         if(bestMatch.diffsize > diffsize )
                         bestMatch= { diff,diffsize, comb ,box_size}
                         else if(bestMatch.diffsize == diffsize && (bestMatch.diff>diff ||bestMatch.box_size<box_size))
                         bestMatch= { diff,diffsize, comb ,box_size}
                     } 
                }       
            }
         }                
    } 
    const  lastAssortment=bestMatch.comb;
    comboSize=0;
    for (let i = 0; i < lastAssortment.length; i++) {
        if( lastAssortment[i]!=0)
        {
            comboSize+=lastAssortment[i]*assortments[i].box_size;
            combo[assortments[i].name]=lastAssortment[i];
            comboBoxCount+=lastAssortment[i]*assortments[i].box_size;

            for (const assortmentSize of assortments[i].sizeQuantities) {
                if (comboSizeSplit[assortmentSize.size] != null) {
                    comboSizeSplit[assortmentSize.size] += parseInt(assortmentSize.quantity)*lastAssortment[i]
                } else {
                    comboSizeSplit[assortmentSize.size] = parseInt(assortmentSize.quantity)*lastAssortment[i]
                }
            }
            // Calculate the resulting diff
            for (const sizeName of Object.keys(comboSizeSplit)) {
                const matchingSize = desiredSizeSplit.find(x => x.name == sizeName)
                const desiredQuantity = matchingSize ? matchingSize.qty : 0
                comboDiff += Math.abs(comboSizeSplit[sizeName] - desiredQuantity)
            }

        }
        
    }  

    return {
        combination: combo,
        sizeSplit: comboSizeSplit,
        diff: comboDiff,
        boxCount: comboBoxCount,
        quantity: comboSize,
    } 
} 
function combinations(combs, size) {
    const result = [];

    if (size === 0) {

        result.push([]);

    } else {

        combinations(combs, size - 1).forEach(function (previousComb) {
            combs.forEach(function (combs) {
                result.push([combs].concat(previousComb));
            });
        });
    }

    return result;
}