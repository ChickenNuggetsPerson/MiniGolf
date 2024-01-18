/* 

masterWin


*/


class WindowManager {
    
    index = -1; // Index of 0 is the main window

    lifeSuffix = "-life";
    lifeTimeout = 20; // Msec

    maxWindows = 10;

    masterSendChannel = "masterSend"
    masterSendData = ""
    masterRecieveData = ""

    constructor() {}

    init() {
        // Asign the window index
        if (!this.isAlive(0)) {
            // Main window has timed out
            this.index = 0;
        } else {
            // Loop through the windows and assign the next one
            for (let i = 1; i < this.maxWindows; i++) {
                if (!this.isAlive(i)) {
                    this.index = i;
                    break;
                }
            }
        }

        // Start update life cycle
        setInterval(() => {
            this.updateLife();
        }, this.lifeTimeout / 2);

        console.log(this.index)

        return this.index
    }

    // Returns true if the window is alive
    isAlive(winNum) { 
        return localStorage.getItem(winNum + this.lifeSuffix) > new Date().getTime()
    }

    updateLife() {
        localStorage.setItem(this.index + this.lifeSuffix, new Date().getTime() + this.lifeTimeout)
    }
    exchangeData() {
        // Broadcast information if it is a master
        // Recieve information otherwise
        if (this.index == 0) {
            localStorage.setItem(this.masterSendChannel, this.masterSendData)
        } else {
            this.masterRecieveData = localStorage.getItem(this.masterSendChannel)
        }
    }


    setSendData(data) { this.masterSendData = data; this.exchangeData(); }
    getRecievedData() { this.exchangeData(); return this.masterRecieveData; }
};