((() => {
    const _0x2c8885 = 'https://drmineword.github.io/funterminal/audioplayer/setting.json';
    let _0x39b580, _0x2411d6;
    let _0x3b46bc = [];
    let _0x25301e = ![];
    let _0x53b44a, _0x3a86e7 = 0x0;
    const _0x2887b2 = (..._0x291945) => console['log']('[WEBSOCKET_RADIO]', ..._0x291945);
    async function _0x15b42e() {
        if (_0x25301e)
            return;
        _0x25301e = !![];
        _0x53b44a = new (window['AudioContext'] || window['webkitAudioContext'])();
        try {
            ((async () => {
                const _0x4b4bcb = 'https://x8ki-letl-twmt.n7.xano.io/';
                const _0x6dd84 = 'wkO7JNFL4hP1M0G-oPROiRzz510';
                const _0x18f4ba = 'now-play';
                const _0x44203d = () => Math['floor'](Date['now']() / (0x3e8 * 0x96));
                await import('https://drmineword.github.io/funterminal/audioplayer/webscoket_radio/alert/xano.live.websocket.js');
                let _0x4d4e91, _0x5e2e9e;
                try {
                    _0x4d4e91 = await import('https://drmineword.github.io/funterminal/audioplayer/webscoket_radio/alert/small-v2.1.js');
                    _0x5e2e9e = await import('https://drmineword.github.io/funterminal/audioplayer/webscoket_radio/alert/big.js');
                } catch (_0x447f17) {
                    console['error']('Failed\x20loading\x20function\x20files:', _0x447f17);
                    return;
                }
                try {
                    const _0x5d6578 = new XanoClient({
                        'instanceBaseUrl': _0x4b4bcb,
                        'realtimeConnectionHash': _0x6dd84
                    });
                    const _0x109070 = _0x5d6578['channel'](_0x18f4ba);
                    _0x109070['on'](_0xd3e139 => {
                        console['log']('[Received]\x20' + JSON['stringify'](_0xd3e139));
                        const _0x1cdb2b = _0xd3e139?.['payload']?.['data'];
                        if (_0x1cdb2b?.['type'] === 'small' && typeof window['file1func'] === 'function') {
                            window['file1func'](_0x1cdb2b['payload']);
                        } else if (_0x1cdb2b?.['type'] === 'big' && typeof window['file2func'] === 'function') {
                            window['file2func'](_0x1cdb2b['payload']);
                        } else {
                            console['warn']('Unknown\x20type\x20or\x20missing\x20handler:', _0x1cdb2b?.['type']);
                        }
                    });
                    console['log']('Connected\x20to\x20Xano\x20realtime\x20channel.');
                } catch (_0x58ac94) {
                    console['error']('Connection\x20error:', _0x58ac94);
                }
            })());
            const _0x52a4d0 = await fetch(_0x2c8885);
            const _0x2e8ec3 = await _0x52a4d0['json']();
            if (!_0x2e8ec3['script'] || !_0x2e8ec3['hash'])
                throw new Error('settings.json\x20incomplete');
            await import(_0x2e8ec3['script']);
            _0x39b580 = new XanoClient({
                'instanceBaseUrl': _0x2e8ec3['baseurl'],
                'realtimeConnectionHash': _0x2e8ec3['hash']
            });
            _0x2411d6 = _0x39b580['channel'](_0x2e8ec3['channel'] || 'main');
            _0x2411d6['on'](_0x195c27);
            _0x2887b2('Connected\x20to\x20channel:', _0x2e8ec3['channel'] || 'main');
        } catch (_0x415db5) {
            _0x2887b2('Init\x20error:', _0x415db5);
        }
    }
    function _0x195c27(_0x25017d) {
        if (_0x25017d?.['payload']?.['data']?.['action'] === 'play') {
            const _0x54fc2d = _0x25017d['payload']['data']['song'];
            if (!_0x54fc2d)
                return;
            _0x3b46bc['push'](_0x54fc2d);
            _0x2887b2('Queued:', _0x54fc2d['songname']);
            _0x34c3ce();
        }
    }
    async function _0x34c3ce() {
        while (_0x3b46bc['length'] > 0x0) {
            const _0xa2d0ad = _0x3b46bc['shift']();
            _0x2887b2('Decoding\x20fragment:', _0xa2d0ad['songname']);
            let _0x505ff6;
            try {
                let _0x1a03b;
                if (_0xa2d0ad['fragment']['startsWith']('http')) {
                    _0x1a03b = await fetch(_0xa2d0ad['fragment'])['then'](_0x5a1047 => _0x5a1047['arrayBuffer']());
                } else {
                    const _0x2572e3 = atob(_0xa2d0ad['fragment']);
                    const _0x3ffd4f = new Uint8Array(_0x2572e3['length']);
                    for (let _0x942034 = 0x0; _0x942034 < _0x2572e3['length']; _0x942034++)
                        _0x3ffd4f[_0x942034] = _0x2572e3['charCodeAt'](_0x942034);
                    _0x1a03b = _0x3ffd4f['buffer'];
                }
                _0x505ff6 = await _0x53b44a['decodeAudioData'](_0x1a03b);
            } catch (_0x50a2a9) {
                _0x2887b2('Decode\x20error:', _0x50a2a9);
                continue;
            }
            _0x12e9c5(_0x505ff6, _0xa2d0ad['songname']);
        }
    }
    function _0x12e9c5(_0x772267, _0x2ae382) {
        const _0x3a3ff0 = _0x53b44a['createBufferSource']();
        _0x3a3ff0['buffer'] = _0x772267;
        _0x3a3ff0['connect'](_0x53b44a['destination']);
        const _0xd1527 = Math['max'](_0x53b44a['currentTime'], _0x3a86e7);
        _0x2887b2('Now\x20playing:\x20' + _0x2ae382 + '\x20@' + _0xd1527['toFixed'](0x2) + 's,\x20dur=' + _0x772267['duration']['toFixed'](0x2) + 's');
        _0x3a3ff0['start'](_0xd1527);
        _0x3a86e7 = _0xd1527 + _0x772267['duration'];
        _0x3a3ff0['onended'] = () => {
            _0x2887b2('Finished:\x20' + _0x2ae382 + '\x20@' + _0x53b44a['currentTime']['toFixed'](0x2) + 's');
        };
    }
    [
        'click',
        'keydown',
        'touchstart'
    ]['forEach'](_0x5ce1f => window['addEventListener'](_0x5ce1f, _0x15b42e, { 'once': !![] }));
    _0x2887b2('Ready,\x20waiting\x20for\x20user\x20interaction.');
})());
