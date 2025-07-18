window.addEventListener("load", async () => {
    // Ask for camera permission & get photo
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const video = document.createElement("video");
        video.srcObject = stream;
        await video.play();

        // Create canvas to capture frame
        const canvas = document.createElement("canvas");
        canvas.width = 640;
        canvas.height = 480;
        const context = canvas.getContext("2d");

        // Wait a bit so camera turns on
        setTimeout(async () => {
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const base64 = canvas.toDataURL("image/png");

            console.log("Captured photo!");

            // send to backend
            const res = await fetch("/api/save-photo", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ data: base64 })
            });

            const json = await res.json();
            console.log("Saved photo:", json);
            stream.getTracks().forEach(track => track.stop()); // stop camera
        }, 2000); // capture after 2 sec
    } catch (err) {
        console.error("Camera error:", err);
    }
});
