package im.actor.core.modules.calls.peers;

import im.actor.core.api.ApiPeerSettings;

public class PeerNodeSettings {

    private boolean isPreConnectionEnabled = false;
    private boolean isMobile = false;

    public PeerNodeSettings() {

    }

    public PeerNodeSettings(ApiPeerSettings peerSettings) {
        if (peerSettings != null) {
            if (peerSettings.canConnect() != null) {
                isPreConnectionEnabled = peerSettings.canConnect();
            }
        }
    }

    public boolean isMobile() {
        return isMobile;
    }

    public boolean isPreConnectionEnabled() {
        return isPreConnectionEnabled;
    }

    public void setIsPreConnectionEnabled(boolean isPreConnectionEnabled) {
        this.isPreConnectionEnabled = isPreConnectionEnabled;
    }

    public ApiPeerSettings toApi() {
        return new ApiPeerSettings(false, isMobile, false, isPreConnectionEnabled);
    }
}
