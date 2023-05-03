const qrcode = require('qrcode-terminal');
const fs = require("fs");
const axios = require('axios');
const { Client } = require('whatsapp-web.js');

const client = new Client({
    puppeteer: {
        args: ['--no-sandbox'],
    }
});
// Save session values to the file upon successful auth
client.on('authenticated', (session) => {
    console.log('session restarted');
});

client.initialize();
client.on("qr", qr => {
    qrcode.generate(qr, {small: true} );
});

client.on('ready', () => {
    console.log("ready to message")
});

client.on('message', async message => {
    try {
        if(message.body.toLowerCase() === '/listtruth'){
            const response = await axios.get('https://truthordare-production.up.railway.app/truth');
            const respon = response.data;
            if(!respon.length == 0){
                const hasilPertanyaan = [];
                respon.forEach(element => {
                    const ambilPertanyaan = element['question']
                    const pertanyaanToString = JSON.stringify(ambilPertanyaan);
                    hasilPertanyaan.push(pertanyaanToString)
                });
                await client.sendMessage(message.from, `LIST TRUTH:\n${hasilPertanyaan.toString().replace(/"/g, ' ').split(',').map((item, index)=>`${index+1}.${item}`).join('\n')}`);
            }else{
                await client.sendMessage(message.from, 'Tidak Ada Pertanyaan!!!')
            };
        }else if(message.body.toLowerCase() === '/listdare'){
            const response = await axios.get('https://truthordare-production.up.railway.app/dare');
            const respon = response.data;
            if(!respon.length == 0){
                const hasilPertanyaan = [];
                respon.forEach(element => {
                    const ambilPertanyaan = element['question']
                    const pertanyaanToString = JSON.stringify(ambilPertanyaan);
                    hasilPertanyaan.push(pertanyaanToString)
                });
                await client.sendMessage(message.from, `LIST DARE:\n${hasilPertanyaan.toString().replace(/"/g, ' ').split(',').map((item, index)=>`${index+1}.${item}`).join('\n')}`);
            }else{
                await client.sendMessage(message.from, 'Tidak Ada Pertanyaan!!!')
            };
        }else if(message.body.toLowerCase() === '/truth'){
            const response = await axios.get('https://truthordare-production.up.railway.app/truth');
            const respon = response.data;
            if(!respon.length == 0){
                const hasilPertanyaan = [];
                respon.forEach(element => {
                    const ambilPertanyaan = element['question']
                    const pertanyaanToString = JSON.stringify(ambilPertanyaan);
                    hasilPertanyaan.push(pertanyaanToString)
                });
                const randomTruth = (hasilPertanyaan) => {
                    const random = (hasilPertanyaan) => hasilPertanyaan[Math.floor(Math.random() * hasilPertanyaan.length)];
                    setInterval(()=>random(hasilPertanyaan), 3000);
                    return random(hasilPertanyaan); 
                };
                await client.sendMessage(message.from, `Pertanyaan Truth:\n-${randomTruth(hasilPertanyaan).replace(/"/g, ' ')}`);
            }else{
                await client.sendMessage(message.from, 'Tidak Ada Pertanyaan!!!\nTambahkan Pertanyaan Dahulu')
            };
        }else if(message.body.toLowerCase() === '/dare'){
            const response = await axios.get('https://truthordare-production.up.railway.app/dare');
            const respon = response.data;
            if(!respon.length == 0){
                const hasilPertanyaan = [];
                respon.forEach(element => {
                    const ambilPertanyaan = element['question']
                    const pertanyaanToString = JSON.stringify(ambilPertanyaan);
                    hasilPertanyaan.push(pertanyaanToString)
                });
                const randomDare = (hasilPertanyaan) => {
                    const random = (hasilPertanyaan) => hasilPertanyaan[Math.floor(Math.random() * hasilPertanyaan.length)];
                    setInterval(()=>random(hasilPertanyaan), 3000);
                    return random(hasilPertanyaan); 
                };
                await client.sendMessage(message.from, `Pertanyaan Dare:\n${randomDare(hasilPertanyaan).replace(/"/g, ' ')}`);
            }else{
                await client.sendMessage(message.from, 'Tidak Ada Pertanyaan!!!\nTambahkan Pertanyaan Dahulu')
            };
        };

        if(message.body.includes('/tambahtruth')){
            const pertanyaan = message.body.split('/tambahtruth')[1];
            const dataPertanyaan = {
                "question": pertanyaan
            };
            await axios.post('https://truthordare-production.up.railway.app/truth', dataPertanyaan);
            await client.sendMessage(message.from, `Pertanyaan truth berhasil ditambahkan`);
        }else if(message.body.includes('/tambahdare')){
            const pertanyaan = message.body.split('/tambahdare')[1];
            const dataPertanyaan = {
                "question": pertanyaan
            };
            await axios.post('https://truthordare-production.up.railway.app/dare', dataPertanyaan);
            await client.sendMessage(message.from, `Pertanyaan dare berhasil ditambahkan`);
        };

        if(message.body.includes('/hapustruth')){
            const id = message.body.split(' ')[1];
            if(!/^\d+$/.test(id)){
                await client.sendMessage(message.from, 'syntax harus berupa angka!!\n(contoh /hapustruth 1)');
                return;
            };
            const dataHapus = {
                "id": id
            };
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                },
                data: dataHapus
            };
            await axios.delete('https://truthordare-production.up.railway.app/truth', config);
            await client.sendMessage(message.from, `Pertanyaan truth nomor ${id} telah dihapus`);
        }else if(message.body.includes('/hapusdare')){
            const id = message.body.split(' ')[1];
            if(!/^\d+$/.test(id)){
                await client.sendMessage(message.from, 'syntax harus berupa angka!!\n(contoh /hapustruth 1)');
                return;
            };
            const dataHapus = {
                "id": id
            };
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                },
                data: dataHapus
            };
            await axios.delete('https://truthordare-production.up.railway.app/dare', config);
            await client.sendMessage(message.from, `Pertanyaan dare nomor ${id} telah dihapus`);
        };

        if(message.body === '/resettruth'){              
            await axios.delete('https://truthordare-production.up.railway.app/truth-reset');
            await client.sendMessage(message.from, 'Truth berhasil di reset!');
        }else if(message.body === '/resetdare'){                          
            await axios.delete('https://truthordare-production.up.railway.app/dare-reset');
            await client.sendMessage(message.from, 'Dare berhasil di reset!');
        };
    } catch (error) {
        console.log(error);
    };
});