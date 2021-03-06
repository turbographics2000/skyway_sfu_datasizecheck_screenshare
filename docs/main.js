const myId = (new MediaStream).id;
console.log(`myId:${myId}`);
function appendVideo(stream) {
    const video = document.createElement('video');
    video.srcObject = stream;
    document.body.appendChild(video);
    video.play();
}
chrome.runtime.sendMessage('eiceogpklagmibnoccdincfglccflknk', { cap: true }, async streamId => {
    let stream = null;
    try {
        stream = await navigator.mediaDevices.getUserMedia({
            video: {
                mandatory: {
                    chromeMediaSource: 'desktop',
                    chromeMediaSourceId: streamId
                }
            }
        });
        appendVideo(stream);
    } catch (e) {
        console.error(e);
        return;
    }
    console.log(`streamId:${stream.id}`);
    const peer = new Peer(myId, {
        key: 'bea1e09a-a7f9-41fb-8700-e6d18ba907bd'
    });
    peer.on('open', id => {
        myIdDisp.textContent = id;
        const room = peer.joinRoom('hoge_fuga_piyo_sfu', { mode: 'sfu', stream, videoBandwidth: 2048 });
        room.on('stream', stream => {
            console.log(`room on stream peerId:${stream.peerId}`);
            appendVideo(stream);
        });
    });
});
