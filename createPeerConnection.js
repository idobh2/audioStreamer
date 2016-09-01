window.createPeerConnection = function (socket) {
	let peer = new webkitRTCPeerConnection(null);
	//candidate
	socket.on("candidate", function (candidate) {
		peer.addIceCandidate(new RTCIceCandidate(candidate));
	});
	peer.onicecandidate = function (e) {
		socket.emit("candidate", e.candidate)
	};
	
	//sdp
	socket.on("sdp", function (desc) {
		peer.setRemoteDescription(desc);
		for(var i in onDescriptionArrivalCallbacks){
			onDescriptionArrivalCallbacks[i]();
		}
	});
	peer.handleDescription = function (desc) {
		peer.setLocalDescription(desc)
		socket.emit("sdp", desc);
	}
	var onDescriptionArrivalCallbacks = [];
	peer.onDescriptionArrival = function(cb){
		onDescriptionArrivalCallbacks.push(cb);
	}
	return peer;
}