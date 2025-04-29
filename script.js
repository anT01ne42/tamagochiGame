(function () {
    "use strict";

    document.addEventListener('DOMContentLoaded', function () {

        //Variables
        //Pet's stats are health and vitamin M
        var ctMaxH = 30,
            ctMaxVM = 30,

            ctCurH = ctMaxH,
            ctCurVM = ctMaxVM,

            intervalH = 1000,
            intervalVM = 2000,

            //When vitamin fall below threshold, pet starts losing health
            threshold = ctMaxH * 0.6,
            points = 2,
            widther = 4,

            //When conditions are dangerous, affected stat bars will be hilited in red
            alive = true,
            dangerH = false,
            dangerVM = false,

            //Get meters to change width and border color
            getMtrH = document.getElementById('mtrH'),
            getMtrVM = document.getElementById('mtrVM'),

            getStyleH = getMtrH.style,
            getStyleVM = getMtrVM.style,
            bdrStart = "1px solid ",

            //Colors for meter borders
            clrDfltH = "#81F781",  //green
            clrDfltVM = "#FAAC58",  //orange

            clrCurH = clrDfltH,
            clrCurVM = clrDfltVM,

            clrWarn = "#FF0040", //red

            //Get buttons for click events
            getBtnVM = document.getElementById('btnVM'),

            //Get style for the feedback div
            getStyleFb = document.getElementById('feedback').style;


        getStyleFb.display = 'none';
        meterWidth();

        //At set intervals, vitamin M decreases.
        setInterval(function () {
            if (alive == true) {
                loseVM();
                checkDangerVM();
            }
        }, intervalVM);

        /*
        What happens in this nest:
        Health starts to drop if vitamin M is too low.
        Meter graphics are adjusted as applicable.
        If the pet is dead, then the ending events trigger.
        */
        setInterval(function () {

            meterWidth();
            checkDangerH();

            //Adjust graphics
            if (dangerH == true) {
                warnH();
                loseH();
            }
            else {
                okH();
            }

            if (dangerVM == true) {
                warnVM();
            }
            else {
                okVM();
            }

            //When your pet runs out of health, it will be a gonner.
            if (ctCurH < 0) {
                alive = false;
            }

            if (alive == false) {
                ending();
            }

        }, intervalH);


        //Clicking on a "Feed" button will restore vitamin and health to your pet.
        getBtnVM.addEventListener("click", function () {
            if (alive == true) {
                if (ctCurVM + points <= ctMaxVM) {
                    ctCurVM = ctCurVM + points;

                    if (ctCurH + points < ctMaxH) {
                        ctCurH = ctCurH + points;
                    }

                    meterWidth();

                    //Check conditions and adjust graphics as appropriate.
                    checkDangerH();
                    checkDangerVM();

                    if (dangerH == false) { okH(); }
                    if (dangerVM == false) { okVM(); }
                }
            }
        });

        //Functions

        function meterWidth() {
            //This updates the width of the meters.
            getStyleH.width = ctCurH * widther + "px";
            getStyleVM.width = ctCurVM * widther + "px";
        }

        function checkDangerVM() {
            if (ctCurVM < threshold) {
                dangerVM = true;
            }
            else {
                dangerVM = false;
            }
        }

        function checkDangerH() {
            if (ctCurVM < threshold && alive == true) {
                dangerH = true;
            }
            else {
                dangerH = false;
            }
        }

        function loseVM() {
            ctCurVM = ctCurVM - points;
        }

        function loseH() {
            ctCurH = ctCurH - points;
        }

        function warnVM() {
            getEyes.innerHTML = eyesSick;
            getStyleVM.border = bdrStart + clrWarn;
        }

        function warnH() {
            getEyes.innerHTML = eyesSick;
            getStyleH.border = bdrStart + clrWarn;
        }

        function okVM() {
            getStyleVM.border = bdrStart + clrDfltVM;
        }

        function ending() {
            getEyes.innerHTML = eyesDead;
            getStyleFb.display = 'block';
        }

    });

})();