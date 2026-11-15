const SoundManager = {
    sounds: {},

    // Load a sound file
    load(name, file, volume = 0.5) {
        const audio = new Audio(file);
        audio.volume = volume;
        audio.preload = "auto";

        this.sounds[name] = audio;
    },

    // Play a sound
    play(name, restart = true) {
        const sound = this.sounds[name];

        if (!sound) return;

        if (restart) {
            sound.currentTime = 0;
        }

        sound.play().catch(error => {
            console.log("Sound playback needs user interaction.");
        });
    },

    // Stop a sound
    stop(name) {
        const sound = this.sounds[name];

        if (!sound) return;

        sound.pause();
        sound.currentTime = 0;
    },

    // Stop all sounds
    stopAll() {
        Object.values(this.sounds).forEach(sound => {
            sound.pause();
            sound.currentTime = 0;
        });
    },

    // Change volume
    setVolume(name, volume) {
        if (this.sounds[name]) {
            this.sounds[name].volume = volume;
        }
    }
};
