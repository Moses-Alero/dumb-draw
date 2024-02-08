// document.addEventListener('DOMContentLoaded', function(evt) {
    
    var canvasSocket;
    var canvasElt;

    var canvas = document.getElementById('drawing-canvas');
    var context = canvas.getContext('2d');
    var colorPicker = document.getElementById('color-picker');
    
    const rect  = canvas.getBoundingClientRect()
    var scaleX = canvas.width / rect.width;   
    var scaleY = canvas.height / rect.height; 
        
    // Set initial pen color
    var penColor = colorPicker.value;

    // Event listener for color picker change
    colorPicker.addEventListener('input', function() {
        penColor = colorPicker.value;
    });

    // Event listeners for drawing
    var isDrawing = false;
    var lastX = 0;
    var lastY = 0;

    canvas.addEventListener('htmx:wsOpen', (e)=>{
        canvasElt  = e.detail.elt;
        console.log(e.detail.socketWrapper)
        canvasSocket = e.detail.socketWrapper
        
       
    
    })    


    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    canvas.addEventListener('htmx:wsAfterMessage', (e)=>{
        const drawData = JSON.parse(e.detail.message)

        context.strokeStyle = drawData.penColor;
        context.lineWidth = 2;
        context.lineCap = 'round';

        let dx = drawData.x
        let dy = drawData.y
        let lX = drawData.lastX
        let lY = drawData.lastY

        context.beginPath();
        context.moveTo(lX, lY);
        context.lineTo(dx,dy);
        context.stroke();

        // [lX, lY] = [x , y];
    })
    

    function startDrawing(e) {

        isDrawing = true;
        let x = (e.offsetX - rect.left) * scaleX;
        let y = (e.offsetY - rect.top) * scaleY;
        [lastX, lastY] = [x, y];
 
    }

    function draw(e) {
        if (!isDrawing) return;
       
        context.strokeStyle = penColor;
        context.lineWidth = 2;
        context.lineCap = 'round';

        let x = (e.offsetX - rect.left) * scaleX;
        let y = (e.offsetY - rect.top) * scaleY;

        context.beginPath();
        context.moveTo(lastX, lastY);
        context.lineTo(x,y);
        context.stroke();

        [lastX, lastY] = [x , y];

        let draw_data = JSON.stringify({
            x,
            y,
            lastX,
            lastY,
            penColor
        })

        canvasSocket.sendImmediately(draw_data, canvasElt)
    }

    function stopDrawing() {
        isDrawing = false;
    }
// });

