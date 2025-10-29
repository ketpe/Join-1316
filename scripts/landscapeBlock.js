/**
 * @description Blocks landscape mode on touch devices with small screens
 * @namespace landscapeBlock
 */


/**
 * @description Checks if the device is a touch device.
 * @function isTouchDevice
 * @memberof landscapeBlock
 * @returns {boolean} True if the device is a touch device, false otherwise.
 */
function isTouchDevice() {
    return matchMedia('(hover: none) and (pointer: coarse)').matches;
}

/**
 * @description Checks if the device is in landscape mode.
 * @function isLandscape
 * @memberof landscapeBlock
 * @returns {boolean} True if the device is in landscape mode, false otherwise.
 */
function isLandscape() {
    return matchMedia('(orientation: landscape)').matches;
}

/**
 * @description Checks if the window width is within the specified maximum width.
 * @function withinMaxWidth
 * @memberof landscapeBlock
 * @param {number} px The maximum width in pixels.
 * @returns {boolean} True if the window width is within the maximum width, false otherwise.
 */
function withinMaxWidth(px) {
    return window.innerWidth <= px;
}

/**
 * @description Updates the landscape block state based on device orientation and size.
 * @function updateLandscapeBlock
 * @memberof landscapeBlock
 * @returns {void}
 */
function updateLandscapeBlock() {
    const active = isTouchDevice() && isLandscape() && withinMaxWidth(1100);

    if(active){
        document.documentElement.classList.add('landscape-blocked', active);
        document.querySelector('.landscape-warning')?.setAttribute('hidden', !active);
    }else{
        document.documentElement.classList.remove('landscape-blocked', active);
        document.querySelector('.landscape-warning')?.setAttribute('hidden', active);
    }
    
}

/** 
 * @description Handles visibility change events to update the landscape block state.
 * @memberof landscapeBlock
 */ 
document.addEventListener('visibilitychange', updateLandscapeBlock);

/**
 * @description Initial call to set the landscape block state on script load.
 * @memberof landscapeBlock
 */
updateLandscapeBlock();