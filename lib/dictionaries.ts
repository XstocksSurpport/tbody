/**
 * Bilingual copy — canon terms (恒纪元 / 乱纪元 / 智子 / 黑暗森林) fixed for Three-Body framing.
 */
import type { ObservationPanelId } from '@/lib/universeCopy';

export type Locale = 'en' | 'zh';

export type PanelMessages = {
  era: string;
  panelLine: string;
  /** Pipe-separated chips shown in the card body (`|` delimiter). */
  keywords: string;
  statusLine: string;
};

export type Dictionary = {
  common: { exit: string };
  gate: {
    title: string;
    subtitle: string;
    chooseEn: string;
    chooseZh: string;
  };
  home: {
    brand: string;
    uplink: string;
    coordLine: string;
    title: string;
    subtitle: string;
    sessionBar: string;
    parallelChannels: string;
    routing: string;
    routingVal: string;
    writePath: string;
    writePathVal: string;
    corridorMap: string;
    enter: string;
    migration1: string;
    migration2: string;
    walletConnect: string;
    walletDisconnect: string;
    igniteTitle: string;
    igniteCorridor: string;
    igniteCorridorHint: string;
    igniteEra: string;
    igniteSharesLabel: string;
    igniteTotalLabel: string;
    igniteSpentLabel: string;
    igniteSpentUnit: string;
    igniteRemainingLabel: string;
    igniteRemainingUnit: string;
    ignitePrimary: string;
    ignitePrimaryEn: string;
    igniteNeedWallet: string;
    igniteWrongChain: string;
    igniteSwitching: string;
    igniteSwitchRejected: string;
    igniteNeedRecipient: string;
    igniteInvalidShares: string;
    igniteOverCap: string;
    ignitePending: string;
    igniteSuccess: string;
    igniteTxFailed: string;
    igniteProgressPerson: string;
    igniteProgressGlobal: string;
    igniteSyncedChain: string;
    igniteAlreadyJoined: string;
    igniteGlobalPoolFull: string;
    eraCurrentLabel: string;
    eraNextLabel: string;
    manifestLine: string;
    heroMark: string;
    heroInfraLine: string;
    protocolTelemetryAria: string;
    protocolTelemetryLabel: string;
    protocolLogs: string;
    microEntropyLabel: string;
    microEntropyCaption: string;
    axiomSupply: string;
    axiomSupplyVal: string;
    axiomInflation: string;
    axiomInflationVal: string;
    axiomExtraction: string;
    axiomExtractionVal: string;
  };
  panels: Record<ObservationPanelId, PanelMessages>;
  audio: Record<ObservationPanelId, string>;
  siteAmbient: { idle: string; mute: string };
  fault: {
    tag: string;
    title: string;
    retry: string;
    home: string;
    digest: string;
  };
  notFound: {
    tag: string;
    title: string;
    back: string;
    brand: string;
  };
  u01: {
    cdHome: string;
    frameTl: string;
    frameBr: string;
    headTitle: string;
    live: string;
    headPulseTitle: string;
    hudAria: string;
    hudLink: string;
    hudMint: string;
    hudState: string;
    hudSealedRing: string;
    hudUtc: string;
    tickAes: string;
    tickPinned: string;
    tickRop: string;
    tickNoWrite: string;
    btnRequery: string;
    jsonEnergy: {
      CONSISTENT: string;
      NOMINAL: string;
      BOUNDED: string;
    };
    termBanner: string;
    termSsh: string;
    termWarnHostKey: string;
    termAuth: string;
    termCmdRead: string;
    termBraceOpen: string;
    termBraceClose: string;
    jsonKeyEra: string;
    jsonKeyVol: string;
    jsonKeyEnergy: string;
    jsonKeyMint: string;
    jsonKeyTs: string;
    eraStable: string;
    termCmdSha: string;
    termShaOk: string;
    termReadDone: string;
    playTitle: string;
    playMint: string;
    playStake: string;
    playMintMsg: string;
    playStakeOn: string;
    playStakeOff: string;
    playApr: string;
    playVault: string;
    playDisclaimer: string;
  };
  u02: {
    pulseTitle: string;
    pulseSub: string;
    navBrand: string;
    streamHead: string;
    ridgeRules: string;
    ridgeTax: string;
    kvPatch: string;
    kvLiq: string;
    patchApplied: string;
    patchReverted: string;
    liq: {
      fluctuating: string;
      uncertain: string;
      reindexing: string;
      bifurcated: string;
    };
    taxNote: string;
    disclaimer: string;
    boot: [string, string, string, string, string, string];
    irqFork: string;
    warnLineage: string;
    ridgeHorizon: string;
    ridgeChaos: string;
    kvTaxPct: string;
    kvNextRevision: string;
    kvNextChaos: string;
    horizon: Record<
      | 'h1'
      | 'h6'
      | 'h12'
      | 'd1'
      | 'd3'
      | 'd5'
      | 'd7'
      | 'd15'
      | 'd30'
      | 'd45'
      | 'd60'
      | 'd90'
      | 'd120'
      | 'd180'
      | 'd270'
      | 'd360',
      string
    >;
    btnInvasion: string;
    dehydrateTitle: string;
    dehydrateBody: string;
    dehydrateConfirm: string;
    dehydrateCancel: string;
    dehydrateLog: string;
    invasionLog: string;
    chaosResetLog: string;
  };
  u03: {
    kicker: string;
    title: string;
    panelPrimary: string;
    panelShadow: string;
    rowIntegrity: string;
    rowPrice: string;
    rowFeed: string;
    rowSource: string;
    rowRegistry: string;
    btnResample: string;
    btnDecohere: string;
    metaDrift: string;
    ghostBanner: string;
    feedA: {
      compromised: string;
      degraded: string;
      drift: string;
    };
    feedB: {
      echoUnstable: string;
      ghostLayer: string;
      nullConsensus: string;
    };
    gap: {
      noRead: string;
      masked: string;
    };
    signalA: {
      unverified: string;
      routedRelay7: string;
    };
    signalB: {
      relay3phase: string;
      unstaged: string;
    };
    playTitle: string;
    btnBellProbe: string;
    btnCognitivePulse: string;
    sliderCognitive: string;
    meterBell: string;
    toastProbe: string;
    toastPulse: string;
    playDisclaimer: string;
  };
  u04: {
    hudTl: string;
    hudTlStrong: string;
    forestStatus: string;
    statSignal: string;
    statExposure: string;
    statTracking: string;
    statIndex: string;
    signalLatent: string;
    signalActive: string;
    riskElevated: string;
    riskHigh: string;
    riskCritical: string;
    riskMaximum: string;
    trackHigh: string;
    trackModerate: string;
    warnPassive: string;
    btnQuery: string;
    btnLog: string;
    btnSilent: string;
    note: string;
    silentTitle: string;
    silentBreak: string;
    radarTitle: string;
    radarHint: string;
    modalRisk: string;
    btnRaid: string;
    btnInvade: string;
    btnTrack: string;
    modalRaid: string;
    modalInvade: string;
    modalTrack: string;
    modalClose: string;
    modalDisclaimer: string;
  };
  audioMuteCorridor: string;
};

export const dictionaries: Record<Locale, Dictionary> = {
  en: {
    common: { exit: 'EXIT' },
    gate: {
      title: 'SELECT INTERFACE LANGUAGE',
      subtitle: "Observation shell · terminology aligned with Remembrance of Earth's Past",
      chooseEn: 'EN',
      chooseZh: 'CN',
    },
    home: {
      brand: '3BODY',
      uplink: 'UPLINK OK',
      coordLine: 'COORDINATE FRAME · SOL III · NEIGHBORING CLUSTER',
      title: '3BODY',
      subtitle: 'STELLAR IGNITION · ON-CHAIN SPARK · 4 CIVILIZATION CORRIDORS',
      sessionBar: 'SESSION · READ ONLY',
      parallelChannels: 'PARALLEL CHANNELS',
      routing: 'ROUTING',
      routingVal: 'CORRIDOR SELECT',
      writePath: 'WRITE PATH',
      writePathVal: 'DISABLED',
      corridorMap: 'CORRIDOR MAP',
      enter: 'ENTER →',
      migration1: 'RESIST CIVILIZATION INTRUSION',
      migration2: 'NOT YET INITIALIZED',
      walletConnect: 'CONNECT WALLET',
      walletDisconnect: 'DISCONNECT',
      igniteTitle: 'STELLAR IGNITION',
      igniteCorridor: 'Corridor',
      igniteCorridorHint: 'Select the civilization to join',
      igniteEra: 'Era',
      igniteSharesLabel: 'Ignition quantity',
      igniteTotalLabel: 'Total due',
      igniteSpentLabel: 'Cumulative spark',
      igniteSpentUnit: 'ETH',
      igniteRemainingLabel: 'Remaining spark',
      igniteRemainingUnit: 'ETH',
      ignitePrimary: 'Ignite',
      ignitePrimaryEn: 'STELLAR IGNITION',
      igniteNeedWallet: 'Connect a wallet first.',
      igniteWrongChain: 'Wrong network — Ethereum Mainnet required.',
      igniteSwitching: 'Switching to Ethereum Mainnet…',
      igniteSwitchRejected: 'Network switch cancelled in wallet.',
      igniteNeedRecipient:
        'Treasury address invalid. Check NEXT_PUBLIC_STELLAR_RECIPIENT override.',
      igniteInvalidShares: 'Enter a positive integer within your remaining allowance.',
      igniteOverCap: 'Exceeds per-wallet cap (0.5 ETH lifetime). Reduce units.',
      ignitePending: 'Awaiting wallet confirmation…',
      igniteSuccess: 'Ignition confirmed on-chain — thank you, Observer.',
      igniteTxFailed: 'Failed',
      igniteProgressPerson: 'Your spark (on-chain)',
      igniteProgressGlobal: 'Network spark pool (on-chain)',
      igniteSyncedChain: 'Live from contract · refreshes with blocks',
      igniteAlreadyJoined:
        'This wallet already joined a civilization via mint(). Further ETH mints are disabled by contract.',
      igniteGlobalPoolFull: 'The on-chain total ETH pool for minting is full. Try a smaller amount later.',
      eraCurrentLabel: 'CURRENT ERA',
      eraNextLabel: 'TIME TO NEXT ERA',
      manifestLine: 'Inside the light cone, fate is sealed.',
      heroMark: 'III',
      heroInfraLine: 'Cosmic sociology · dark-forest observatory stack',
      protocolTelemetryAria: 'Protocol telemetry',
      protocolTelemetryLabel: 'OBSERVER LOG · RELAY',
      protocolLogs:
        '[Block relay] Mesh coherence nominal.|Liquidity drift · bounded.|MEV envelope · suppressed.|Channel entropy · declining.|Cross-chain veil · steady.|Signal residue · below threshold.',
      microEntropyLabel: 'CIVILIZATION ENTROPY GRADIENT',
      microEntropyCaption: 'Synthetic index · observational layer only',
      axiomSupply: 'Supply',
      axiomSupplyVal: 'Finite',
      axiomInflation: 'Inflation',
      axiomInflationVal: 'None',
      axiomExtraction: 'Extraction',
      axiomExtractionVal: 'Structurally impossible',
    },
    panels: {
      u01: {
        era: 'STABLE ERA',
        panelLine: 'CIVILIZATION IS STABLE',
        keywords:
          'LOW VOLATILITY|READ-ONLY BOUNDS|PREDICTABLE FEEDBACK|SLOW ON-CHAIN SETTLEMENT|CALM PACE',
        statusLine: 'STATUS: ACTIVE',
      },
      u02: {
        era: 'CHAOTIC ERA',
        panelLine: 'RULES ARE CHANGING',
        keywords:
          'RULE FORKS|STACKED FEE LAYERS|LATER OVERRIDES EARLIER|HIGH ENTROPY|SWINGS ON REWRITE',
        statusLine: 'STATUS: UNSTABLE',
      },
      u03: {
        era: 'SOPHON ERA',
        panelLine: 'COGNITIVE MARKET LAYER',
        keywords:
          'DUAL LEDGERS MISALIGNED|SPREAD VS INTEGRITY|COGNITIVE BIAS|ASYMMETRIC EXECUTION|INTENTIONAL SPLIT',
        statusLine: 'STATUS: STRATIFIED',
      },
      u04: {
        era: 'DARK FOREST',
        panelLine: 'DO NOT EXPOSE YOURSELF',
        keywords:
          'MIN DISCLOSURE|THIN LIQUIDITY|Mempool · indexers · listeners|Sell · transfer · HFT footprint|Hunt · sandwich · front-run|Rare · minimal exposure',
        statusLine: 'STATUS: SILENT',
      },
    },
    audio: {
      u01: '[ STABLE BED ]',
      u02: '[ ENTROPY FIELD ]',
      u03: '[ COGNITIVE CARRIER ]',
      u04: '[ DEEP BAND ]',
    },
    siteAmbient: { idle: '[ ATMOSPHERE · TAP OR CLICK ]', mute: '[ MUTE ]' },
    fault: {
      tag: '[ fault ]',
      title: 'Something broke',
      retry: 'retry',
      home: '← home',
      digest: 'digest',
    },
    notFound: {
      tag: '[ ROUTE UNKNOWN ]',
      title: 'NOT FOUND',
      back: 'RETURN',
      brand: '3BODY',
    },
    u01: {
      cdHome: '← cd /system',
      frameTl: 'SSH/TLS · READ ONLY',
      frameBr: 'NO EXEC · SIGNED READ',
      headTitle: 'U-01 · bash · 80×24 · READ ONLY',
      live: 'LIVE',
      headPulseTitle: 'session layer live',
      hudAria: 'Corridor telemetry',
      hudLink: 'LINK',
      hudMint: 'MINT LOAD',
      hudState: 'STATE',
      hudSealedRing: '% sealed ring',
      hudUtc: ' UTC',
      tickAes: 'AES256',
      tickPinned: 'PINNED',
      tickRop: 'ROP-GUARD',
      tickNoWrite: 'NO-WRITE',
      btnRequery: './requery_registry.sh',
      jsonEnergy: {
        CONSISTENT: 'CONSISTENT',
        NOMINAL: 'NOMINAL',
        BOUNDED: 'BOUNDED',
      },
      termBanner: '/* U-01 · STABLE_STRATUM · {{sess}} */',
      termSsh: '$ ssh -o StrictHostKeyChecking=accept-new observatory-u01@corridor.internal',
      termWarnHostKey: 'Warning: permanently added ECDSA key fingerprint.',
      termAuth: 'Authenticated: AES-256-GCM · session pinned.',
      termCmdRead: 'observatory-u01@node:~$ ./bin/read_registry --json --sealed',
      termBraceOpen: '{',
      termBraceClose: '}',
      jsonKeyEra: 'era',
      jsonKeyVol: 'system_volatility',
      jsonKeyEnergy: 'energy_flow',
      jsonKeyMint: 'mint_capacity_used_pct',
      jsonKeyTs: 'query_timestamp_utc',
      eraStable: 'STABLE',
      termCmdSha: 'observatory-u01@node:~$ sha256sum ./snapshot/status.json',
      termShaOk: ' e4b5f792 · OK · matched signing key u01-root',
      termReadDone: '// READ COMPLETE · NO WRITE PATH · TOKEN SINGLE-USE',
      playTitle: 'Observation bandwidth · sow and accrual',
      playMint: 'SOW',
      playStake: 'ACCRUE',
      playMintMsg: '[vault] sow_batch acknowledged · capacity line +Δ · sealed',
      playStakeOn: 'yield rail OPEN · corridor APY reference active',
      playStakeOff: 'yield rail IDLE',
      playApr: 'Corridor APR',
      playVault: 'Vault units',
      playDisclaimer:
        'Sow and accrual route through this observatory shell · settlement cadence follows corridor policy.',
    },
    u02: {
      pulseTitle: 'KERNEL FORK · PARAMETERS UNDER RECONFIGURATION',
      pulseSub:
        'BYTE STREAM APPEND-ONLY · DISPLAY HEAD MAY INVALIDATE PRIOR LINES WITHOUT ERASURE EVENT',
      navBrand: 'U-02 · AMBER FIELD CONSOLE',
      streamHead: 'STDERR / HEX INTERLEAVE · LIVE',
      ridgeRules: 'LIVE RULE SLICE',
      ridgeTax: 'TAX STRATUM · SUPERSESSION STACK',
      kvPatch: 'PATCH STATE',
      kvLiq: 'LIQUIDITY',
      patchApplied: 'APPLIED',
      patchReverted: 'REVERTED',
      liq: {
        fluctuating: 'FLUCTUATING',
        uncertain: 'UNCERTAIN',
        reindexing: 'RE-INDEXING',
        bifurcated: 'BIFURCATED',
      },
      taxNote: 'ACTIVE SURFACE · NOT STABLE UNDER RETRIES',
      disclaimer:
        'AMBER CHANNEL · INTENTIONAL SIGNAL LOSS · OPERATORS TRAIN ON NOISE',
      boot: [
        '>> ring0 · bootstrap · stderr mux attach OK',
        '0x7fa3c · slab_dirty · tier-2 partial flush',
        'warn: RULE_GRAPH noncommittal · ordering undefined',
        '>> heartbeat · supervisor pid 0x4f2a · watchdog armed',
        'mem: 0x19a400 · checksum soft-fail · continuing',
        'trace: TAX_MUX deferred write · queue depth 3',
      ],
      irqFork: 'irq · rule_fork',
      warnLineage: 'warn · lineage divergent',
      ridgeHorizon: 'REVISION CADENCE',
      ridgeChaos: 'NEXT CHAOS WINDOW',
      kvTaxPct: 'TARIFF · TOP STRATUM',
      kvNextRevision: 'NEXT TARIFF EVENT',
      kvNextChaos: 'NEXT ENTROPY CASCADE',
      horizon: {
        h1: '1 hour',
        h6: '6 hours',
        h12: '12 hours',
        d1: '1 day',
        d3: '3 days',
        d5: '5 days',
        d7: '7 days',
        d15: '15 days',
        d30: '30 days',
        d45: '45 days',
        d60: '60 days',
        d90: '90 days',
        d120: '120 days',
        d180: '180 days',
        d270: '270 days',
        d360: '360 days',
      },
      btnInvasion: 'CHAOTIC ERA · DEHYDRATION',
      dehydrateTitle: 'DEHYDRATION',
      dehydrateBody:
        'Choose dehydration to survive — 99% of tokens will be frozen until the next Stable Era.',
      dehydrateConfirm: 'DEHYDRATE',
      dehydrateCancel: 'CANCEL',
      dehydrateLog: 'dehydration · 99% corridor tokens sealed · thaw pending stable era',
      invasionLog: 'intrusion · hostile liquidity wedge · entropy spike logged',
      chaosResetLog: 'chaos cycle · phase boundary crossed · tariff lattice reshuffled',
    },
    u03: {
      kicker: 'INTERFERENCE LAB · U-03',
      title: 'Two registers that refuse one reality.',
      panelPrimary: 'PRIMARY SHEET',
      panelShadow: 'SHADOW SHEET',
      rowIntegrity: 'INTEGRITY',
      rowPrice: 'PRICE',
      rowFeed: 'FEED',
      rowSource: 'SOURCE',
      rowRegistry: 'REGISTRY',
      btnResample: 'RESAMPLE BOTH',
      btnDecohere: 'FORCE DECOHERENCE',
      metaDrift: 'DRIFT ·',
      ghostBanner: 'NON-OBJECTIVE COLLAPSE · BOTH SHEETS STALE',
      feedA: {
        compromised: 'PARTIALLY COMPROMISED',
        degraded: 'DEGRADED',
        drift: 'CRITICAL DRIFT',
      },
      feedB: {
        echoUnstable: 'ECHO · UNSTABLE',
        ghostLayer: 'GHOST LAYER',
        nullConsensus: 'NULL CONSENSUS',
      },
      gap: {
        noRead: '[ NO READ ]',
        masked: '██████',
      },
      signalA: {
        unverified: 'UNVERIFIED',
        routedRelay7: 'ROUTED · RELAY 7',
      },
      signalB: {
        relay3phase: 'RELAY 3 (PHASE)',
        unstaged: 'UNSTAGED',
      },
      playTitle: 'Sophon instruments · cognitive coupling',
      btnBellProbe: 'BELL · PROBE PAIR',
      btnCognitivePulse: 'COGNITIVE PULSE',
      sliderCognitive: 'Injection depth',
      meterBell: 'Ledger mismatch φ',
      toastProbe: 'entangled probe pulse fired · phase plane jitter logged',
      toastPulse: 'cognitive carrier imprint · interference staged on shadow sheet',
      playDisclaimer:
        'Controls reshape telemetry on this sheet · upstream execution remains partitioned.',
    },
    u04: {
      hudTl: 'PASSIVE SONAR · U-04',
      hudTlStrong: 'DARK FOREST · NO BROADCAST ASSUMED SAFE',
      forestStatus: 'FOREST STATUS',
      statSignal: 'SIGNAL LEVEL',
      statExposure: 'EXPOSURE RISK',
      statTracking: 'TRACKING POSSIBILITY',
      statIndex: 'EXPOSURE INDEX',
      signalLatent: 'LATENT',
      signalActive: 'ACTIVE',
      riskElevated: 'ELEVATED',
      riskHigh: 'HIGH',
      riskCritical: 'CRITICAL',
      riskMaximum: 'MAXIMUM',
      trackHigh: 'HIGH',
      trackModerate: 'MODERATE',
      warnPassive: 'PASSIVE WINDOW OPEN · ASSUME ALIGNMENT',
      btnQuery: 'QUERY · +SIG',
      btnLog: 'LOG CONTACT',
      btnSilent: 'SILENT',
      note: 'ONLY THIS CORRIDOR USES PHOSPHOR GREEN ARMATURE · ALL OTHERS DIFFER BY DESIGN.',
      silentTitle: '[ SILENT MODE ACTIVE ]',
      silentBreak: 'BREAK SILENCE · EMIT SIGNATURE',
      radarTitle: 'FOREST RADAR · EXPOSURE DOTMAP',
      radarHint: 'Dots redden with latent exposure · click to inspect coordinates',
      modalRisk: 'Exposure index',
      btnRaid: 'RAID · STRIP BANDWIDTH',
      btnInvade: 'INVADE · HIGH NOISE',
      btnTrack: 'TRACK · PASSIVE LOCK',
      modalRaid: 'Raid logged · bandwidth strip recorded on the contact sheet.',
      modalInvade: 'Invasion pulse emitted · coordinate window saturated with noise.',
      modalTrack: 'Passive lock queued · watcher orbit bound to this corridor session.',
      modalClose: 'CLOSE',
      modalDisclaimer:
        'Outcomes append to the forest contact log · classification follows the exposure index.',
    },
    audioMuteCorridor: '[ MUTE · CORRIDOR ]',
  },
  zh: {
    common: { exit: '退出' },
    gate: {
      title: '选择界面语言',
      subtitle: '观测终端 · 名词与《地球往事》系列语境对齐（恒纪元 / 乱纪元等不作随意改写）',
      chooseEn: 'EN',
      chooseZh: 'CN',
    },
    home: {
      brand: '3BODY',
      uplink: '上行链路正常',
      coordLine: '坐标系 · 太阳系第三行星 · 邻近星团参照',
      title: '3BODY',
      subtitle: '恒星点燃 · 链上火种 · 四条文明走廊',
      sessionBar: '会话 · 只读',
      parallelChannels: '并行信道',
      routing: '路由',
      routingVal: '走廊选择',
      writePath: '写入路径',
      writePathVal: '已禁用',
      corridorMap: '走廊映射',
      enter: '进入 →',
      migration1: '抵抗文明入侵',
      migration2: '尚未初始化',
      walletConnect: '连接钱包',
      walletDisconnect: '断开',
      igniteTitle: '恒星点燃',
      igniteCorridor: '文明走廊',
      igniteCorridorHint: '请选择加入的文明',
      igniteEra: '纪元',
      igniteSharesLabel: '点燃数量',
      igniteTotalLabel: '应付合计',
      igniteSpentLabel: '累计火种',
      igniteSpentUnit: '火种',
      igniteRemainingLabel: '剩余火种',
      igniteRemainingUnit: 'ETH',
      ignitePrimary: '恒星点燃',
      ignitePrimaryEn: 'STELLAR IGNITION',
      igniteNeedWallet: '请先连接钱包。',
      igniteWrongChain: '当前网络不正确，请使用以太坊主网。',
      igniteSwitching: '正在切换到以太坊主网…',
      igniteSwitchRejected: '已在钱包中取消切换网络。',
      igniteNeedRecipient:
        '收款地址无效，请检查 NEXT_PUBLIC_STELLAR_RECIPIENT 覆盖配置。',
      igniteInvalidShares: '请输入不超过剩余额度的正整数份数。',
      igniteOverCap: '超出单钱包终身 0.5 ETH 上限，请减少份数。',
      ignitePending: '等待钱包确认…',
      igniteSuccess: '链上已确认——感谢，观测者。',
      igniteTxFailed: '失败',
      igniteProgressPerson: '个人火种占用（链上）',
      igniteProgressGlobal: '全网火种池（链上）',
      igniteSyncedChain: '合约实时读取 · 随区块刷新',
      igniteAlreadyJoined: '该钱包已通过 mint 加入文明；合约禁止再次铸造。',
      igniteGlobalPoolFull: '链上全网 ETH 铸造池已满，请减少份数或稍后再试。',
      eraCurrentLabel: '当前纪元',
      eraNextLabel: '距离下一纪元',
      manifestLine: '光锥之内，即是命运。',
      heroMark: 'III',
      heroInfraLine: '宇宙社会学 · 黑暗森林观测栈',
      protocolTelemetryAria: '协议遥测',
      protocolTelemetryLabel: '观测日志 · 中继',
      protocolLogs:
        '[区块中继] 网格相干 · 正常。|流动性漂移 · 有界。|MEV 包络 · 抑制。|信道熵 · 下降。|跨链遮蔽 · 稳定。|信号残差 · 低于阈值。',
      microEntropyLabel: '文明熵梯度',
      microEntropyCaption: '合成指标 · 仅观测层',
      axiomSupply: '供给',
      axiomSupplyVal: '有限',
      axiomInflation: '通胀',
      axiomInflationVal: '无',
      axiomExtraction: '抽取',
      axiomExtractionVal: '结构上不可能',
    },
    panels: {
      u01: {
        era: '恒纪元',
        panelLine: '文明处于恒纪元 · 结构稳定',
        keywords: '低波动|只读边界|反馈可预期|链上沉降慢|节奏平稳',
        statusLine: '状态：活跃',
      },
      u02: {
        era: '乱纪元',
        panelLine: '规则剧烈变动 · 纪元偏移',
        keywords: '规则分叉|多层费率叠加|后者覆盖前者|高熵路径|改写则失稳',
        statusLine: '状态：失稳',
      },
      u03: {
        era: '智子纪元',
        panelLine: '认知层暴露 · 执行路径分化',
        keywords: '双簿错位|价差撕裂|认知干涉|不对称执行|刻意分裂',
        statusLine: '状态：分层',
      },
      u04: {
        era: '黑暗森林',
        panelLine: '切勿暴露自身坐标',
        keywords: '最少披露|流动性薄|内存池与索引监听|卖出·转账·高频风险|猎杀·夹击·抢跑|极低暴露',
        statusLine: '状态：静默',
      },
    },
    audio: {
      u01: '[ 恒纪元底噪 ]',
      u02: '[ 乱纪元熵场 ]',
      u03: '[ 智子载波 ]',
      u04: '[ 黑暗森林深带 ]',
    },
    siteAmbient: { idle: '[ 环境音 · 点按屏幕 ]', mute: '[ 静音 ]' },
    fault: {
      tag: '[ 故障 ]',
      title: '东西坏了',
      retry: '重试',
      home: '← 首页',
      digest: '摘要',
    },
    notFound: {
      tag: '[ 路由未知 ]',
      title: '未找到',
      back: '返回',
      brand: '3BODY',
    },
    u01: {
      cdHome: '← 返回 /system',
      frameTl: 'SSH/TLS · 只读',
      frameBr: '禁止执行 · 签名只读',
      headTitle: 'U-01 · bash · 80×24 · 只读',
      live: '在线',
      headPulseTitle: '会话层存活',
      hudAria: '走廊遥测',
      hudLink: '链路',
      hudMint: '铸环负载',
      hudState: '状态',
      hudSealedRing: '% 密封环',
      hudUtc: ' UTC',
      tickAes: 'AES256',
      tickPinned: '钉扎',
      tickRop: 'ROP 防护',
      tickNoWrite: '无写',
      btnRequery: './requery_registry.sh',
      jsonEnergy: {
        CONSISTENT: '一致',
        NOMINAL: '额定',
        BOUNDED: '有界',
      },
      termBanner: '/* U-01 · 稳定层 · {{sess}} */',
      termSsh: '$ ssh -o StrictHostKeyChecking=accept-new observatory-u01@corridor.internal',
      termWarnHostKey: '警告：已永久添加 ECDSA 主机指纹。',
      termAuth: '已认证：AES-256-GCM · 会话已钉扎。',
      termCmdRead: 'observatory-u01@node:~$ ./bin/read_registry --json --sealed',
      termBraceOpen: '{',
      termBraceClose: '}',
      jsonKeyEra: 'era',
      jsonKeyVol: 'system_volatility',
      jsonKeyEnergy: 'energy_flow',
      jsonKeyMint: 'mint_capacity_used_pct',
      jsonKeyTs: 'query_timestamp_utc',
      eraStable: 'STABLE',
      termCmdSha: 'observatory-u01@node:~$ sha256sum ./snapshot/status.json',
      termShaOk: ' e4b5f792 · 校验通过 · 签名密钥 u01-root',
      termReadDone: '// 读取完成 · 无写路径 · 令牌一次性',
      playTitle: '观测带宽 · 播种与生息',
      playMint: '播种',
      playStake: '生息',
      playMintMsg: '[vault] 播种批次已确认 · 容量曲线 +Δ · 已密封',
      playStakeOn: '生息通道开启 · 走廊参考利率已生效',
      playStakeOff: '生息通道闲置',
      playApr: '走廊参考 APY',
      playVault: '池内单位',
      playDisclaimer: '播种与生息经由此观测台壳层路由 · 结算节奏遵循走廊策略。',
    },
    u02: {
      pulseTitle: '内核分叉 · 参数重配置中',
      pulseSub: '字节流仅追加 · 显示头可在无擦除事件下使旧行失效',
      navBrand: 'U-02 · 琥珀场控制台',
      streamHead: '标准错误 / 十六进制交织 · 实时',
      ridgeRules: '实时规则切片',
      ridgeTax: '税层 · 超覆栈',
      kvPatch: '补丁状态',
      kvLiq: '流动性',
      patchApplied: '已应用',
      patchReverted: '已回滚',
      liq: {
        fluctuating: '波动',
        uncertain: '不确定',
        reindexing: '重建索引',
        bifurcated: '分叉',
      },
      taxNote: '活跃表面 · 重试下不稳定',
      disclaimer: '琥珀信道 · 有意信号丢失 · 操作者在噪声中训练',
      boot: [
        '>> ring0 · 引导 · stderr 复用挂载 OK',
        '0x7fa3c · slab_dirty · 二级部分刷盘',
        'warn: RULE_GRAPH 未承诺 · 顺序未定义',
        '>> 心跳 · 监管 pid 0x4f2a · 看门狗已武装',
        'mem: 0x19a400 · 校验软失败 · 继续',
        'trace: TAX_MUX 延迟写入 · 队列深度 3',
      ],
      irqFork: 'irq · 规则分叉',
      warnLineage: 'warn · 谱系发散',
      ridgeHorizon: '修订节奏',
      ridgeChaos: '下一混乱周期',
      kvTaxPct: '关税 · 顶层',
      kvNextRevision: '下次税则重议',
      kvNextChaos: '下次熵增级联',
      horizon: {
        h1: '1 小时',
        h6: '6 小时',
        h12: '12 小时',
        d1: '1 天',
        d3: '3 天',
        d5: '5 天',
        d7: '7 天',
        d15: '15 天',
        d30: '30 天',
        d45: '45 天',
        d60: '60 天',
        d90: '90 天',
        d120: '120 天',
        d180: '180 天',
        d270: '270 天',
        d360: '360 天',
      },
      btnInvasion: '乱纪元 · 脱水',
      dehydrateTitle: '脱水',
      dehydrateBody:
        '选择脱水以存活，99%的代币将被冻结，在下次恒纪元到来时将会解冻。',
      dehydrateConfirm: '确认脱水',
      dehydrateCancel: '取消',
      dehydrateLog: '脱水 · 走廊代币 99% 已封存 · 解冻条件：恒纪元',
      invasionLog: '入侵 · 敌对流动性楔入 · 熵刺已记档',
      chaosResetLog: '混乱周期 · 相界穿越 · 税格重洗',
    },
    u03: {
      kicker: '干涉实验室 · U-03',
      title: '两份寄存器，拒绝同一种现实。',
      panelPrimary: '主表',
      panelShadow: '影表',
      rowIntegrity: '完整性',
      rowPrice: '价格',
      rowFeed: '馈送',
      rowSource: '来源',
      rowRegistry: '注册项',
      btnResample: '双表重采样',
      btnDecohere: '强制退相干',
      metaDrift: '漂移 ·',
      ghostBanner: '非客观坍缩 · 双表均已过期',
      feedA: {
        compromised: '部分受损',
        degraded: '劣化',
        drift: '临界漂移',
      },
      feedB: {
        echoUnstable: '回声 · 不稳',
        ghostLayer: '幽灵层',
        nullConsensus: '空共识',
      },
      gap: {
        noRead: '[ 无读数 ]',
        masked: '██████',
      },
      signalA: {
        unverified: '未验证',
        routedRelay7: '已路由 · 中继 7',
      },
      signalB: {
        relay3phase: '中继 3（相位）',
        unstaged: '未登台',
      },
      playTitle: '智子仪 · 认知耦合',
      btnBellProbe: 'Bell · 纠缠探针',
      btnCognitivePulse: '认知脉冲',
      sliderCognitive: '注入深度',
      meterBell: '双表失配 φ',
      toastProbe: '纠缠探针已发射 · 相面抖动已记录',
      toastPulse: '认知载波刻写 · 影表叠影已加戏',
      playDisclaimer: '旋钮与按钮在此页重排遥测 · 上游执行面保持隔离。',
    },
    u04: {
      hudTl: '被动声呐 · U-04',
      hudTlStrong: '黑暗森林 · 预设广播皆不安全',
      forestStatus: '森林状态',
      statSignal: '信号等级',
      statExposure: '暴露风险',
      statTracking: '被追踪可能',
      statIndex: '暴露指数',
      signalLatent: '潜伏',
      signalActive: '活跃',
      riskElevated: '升高',
      riskHigh: '高',
      riskCritical: '危急',
      riskMaximum: '极限',
      trackHigh: '高',
      trackModerate: '中等',
      warnPassive: '被动窗口开启 · 假定已对齐',
      btnQuery: '查询 · +信号',
      btnLog: '记录接触',
      btnSilent: '静默',
      note: '仅此走廊使用磷绿骨架 · 其余走廊刻意不同。',
      silentTitle: '[ 静默模式已启用 ]',
      silentBreak: '打破静默 · 发射特征',
      radarTitle: '森林雷达 · 暴露点图',
      radarHint: '颜色越红暴露越高 · 点击查看坐标',
      modalRisk: '暴露指数',
      btnRaid: '掠夺 · 带宽剥取',
      btnInvade: '入侵 · 强噪',
      btnTrack: '跟踪 · 被动锁定',
      modalRaid: '掠夺已入账 — 带宽剥取已写入接触记录。',
      modalInvade: '入侵脉冲已广播 — 坐标窗已被噪声饱和。',
      modalTrack: '被动锁定排队 — 监视轨道已绑定本走廊会话。',
      modalClose: '关闭',
      modalDisclaimer: '结果写入森林接触日志 · 归类随暴露指数滚动。',
    },
    audioMuteCorridor: '[ 静音 · 走廊 ]',
  },
};

export function pick<T>(locale: Locale | null, en: T, zh: T): T {
  return locale === 'zh' ? zh : en;
}
