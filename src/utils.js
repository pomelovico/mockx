export const throttle = (callback,duration)=>{
    let timer  = null,
        start = 0;
    return function(){
        const args = arguments
        let now = +new Date();

        const remaining = duration - ( now - start);
        const context= this;

        if(remaining < 0 || remaining >duration){
            if(timer){
                clearTimeout(timer);
                timer = null;
            }
            callback.apply(this, args);
            start = now;
        }else{
            clearTimeout(timer);
            timer = setTimeout(()=>{
                callback.apply(this, args);
                timer = null;
            },remaining);
        }
    }
}

export default {
    throttle
}