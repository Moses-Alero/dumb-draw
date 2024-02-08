var canvas = document.getElementById('drawing-canvas');

canvas.addEventListener('htmx:wsOpen', (e)=>{
    const fromElt = e.detail.elt;
    console.log(e.detail.socketWrapper)
    const socket = e.detail.socketWrapper
    
    socket.sendImmediately('Hello from the other side', fromElt)

})

// canvas.addEventListener('htmx:wsBeforeMessage', (e)=>{
//     const drawData = JSON.parse(e.detail.message)
//     console.log(drawData.penColor);
// })