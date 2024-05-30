"use strict";
{
    const earthYears = Object.freeze({
        Mercury: 0.2408467,
        Venus: 0.61519726,
        Earth: 1.0,
        Mars: 1.8808158,
        Jupiter: 11.862615,
        Saturn: 29.447498,
        Uranus: 84.016846,
        Neptune: 164.79132
    });
    // export 
    function age(planet, seconds) {
        return (seconds / 31557600) * earthYears[planet];
    }
    console.log(age('Jupiter', 1000000000));
}
