import React from 'react';
import axios from 'axios';

const api = {
    apiKey: 'w4JM4g8Rjdh_SIRJAVA_JJht1eRXuDhn',
    server_of: 'http://anchoratechs.dv/instabolt.api/',
    server_on: 'https://restapi.sirjavaofficial.com/'
}
api.apiURL = api.server_of + '?request=';

const app = {
    version: '1.0.0',
    dbpref: 'cp_'
}

const date = {
    td: new Date().toISOString().slice(0, 10) + ' ' + new Date().toLocaleDateString('en-GB', { hour: '2-digit', minute: '2-digit', second: 'numeric' }).slice(12, 20),
    dt: new Date().toISOString().slice(0, 10),
    yr: new Date().toISOString().slice(0, 4),
    tm: new Date().toLocaleDateString('en-GB', { hour: '2-digit', minute: '2-digit', second: 'numeric' }).slice(12, 20)
}


// Storage
const setStorage = (key, value) => {
    if (key && value) {
        localStorage.setItem(app.dbpref + key, value);
    }
}
const getStorage = (key) => {
    const value = localStorage.getItem(app.dbpref + key);
    return value || '';
}
const setStorageJson = (key, value) => {
    if (key && value) {
        localStorage.setItem(app.dbpref + key, JSON.stringify(value));
    }
}
const getStorageJson = (key) => {
    if (key) {
        const value = localStorage.getItem(app.dbpref + key);
        return JSON.parse(value) || [];
    }
}
const delStorage = (key) => {
    if (key) {
        localStorage.removeItem(app.dbpref + key);
    }
}



const inArray = (needle, haystack) => {
    var length = haystack.length;
    for (var i = 0; i < length; i++) {
        if (haystack[i] === needle) return true;
    }
    return false;
}
const getFileExtension = (filename) => {
    var ext = /^.+\.([^.]+)$/.exec(filename);
    return ext === null ? '' : ext[1];
}


// Data Request
const tokey = '&apiKey=' + api.apiKey + '&apiToken=' + getStorage('userToken');
const serData = (obj) => {
    var str = [];
    for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
            str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
        }
    }
    return str.join('&');
}
const jsnData = (str) => {
    var obj = {};
    var data = str.split('&');
    for(var key in data){
        obj[data[key].split('=')[0]] = data[key].split('=')[1];
    }
    return obj;
}
const postData = async (action, data = {}) => {
    try {
        const response = await fetch(api.apiURL + action, {
            method: 'POST',
            headers: { 'Content-Type':'application/x-www-form-urlencoded' },
            body: serData(data) + tokey
        });
        return response.json();
    }
    catch (error) {
        console.error(error);
    }
    // return await axios.post(api.apiURL + action, data).then(res => {
    //     return res.data;
    // });
}
const getData = async (action) => {
    // try {
    //     const response = await fetch(api.apiURL + action, {
    //         method: 'GET',
    //         headers: { 'Content-Type':'application/json' }
    //     });
    //     return response.json();
    // }
    // catch (error) {
    //     console.error(error);
    // }
    return await axios.get(api.apiURL + action).then(res => {
        return res.data;
    }).catch(e => {
        return e;
    });
}


// Alert Message
const alertMsgSet = (status, msg) => {
    setStorageJson('alertMsg', { status: status, msg: msg });
}
const alertMsg = (statos, msj) => {
    let alert = getStorageJson('alertMsg');
    let msg = msj ? msj : alert.msg;
    let status = statos ? statos : alert.status;
    if (msg && status) {
        delStorage('alertMsg');
        delStorage('alertStatus');
        return <div className={'text-center alert alert-' + status} role="alert">{msg}</div>;
    }
}

// Spinners
const fspinner = () => { //text-align:center;color:#999;line-height:320px;width:100%;
    return <div style={{ textAlign: 'center', color: '#999', lineHeight: 320 + 'px', width: 100 + '%' }}><i className="fa fa-spin fa-circle-o-notch fa-5x"></i></div>;
}
const fspinner_sm = () => {
    return <div style={{ textAlign: 'center', color: '#999', lineHeight: 120 + 'px', width: 100 + '%' }}><i className="fa fa-spin fa-circle-o-notch fa-3x"></i></div>;
}
const fspinner_xs = () => {
    return <i class="fa fa-spin fa-circle-o-notch"></i>;
}

const redirect = (to) => {
    window.location = to;
}


export {
    api, app, date,
    setStorage, getStorage, setStorageJson, getStorageJson, delStorage,
    serData, jsnData, postData, getData,
    inArray, getFileExtension,
    alertMsg, alertMsgSet,
    fspinner, fspinner_sm, fspinner_xs,
    redirect
};