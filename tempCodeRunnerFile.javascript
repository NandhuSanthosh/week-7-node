
function c(){
    return new Promise( (resove, reject)=>{
        // setTimeout(()=>{
            resove(true);
        // }, 100)
    })
}

async function a(){
    c().then( ()=>{
        return 1;
    })
    return 10
}

async function b(){
    let m = await a();
    console.log(m);
}
b()