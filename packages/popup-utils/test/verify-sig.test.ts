import { providers } from 'ethers';
import { verifyMessageSignature, verifyTypedDataSignature } from '../src/index';

const test_data = [
  {
    message: '0.mi9lp5ygu2d',
    sig: '0x9f1fb1b549458368c57b3e26510e37b318c5cb70d8620648a64a01792644be304df20936877e58aca0ec66bc2b43f24ee6c987494d915924c5b9743b45ddeb051c',
    address: '0x66f6161fF96546fE6c32F85b0Ee2Bff686a6c9E6',
    isEIP191Prefix: true,
    ret: true,
  },
  {
    message: '0.3u9hwi7mtmh',
    sig: '0x60f9df7cdea51deb65439e82d523ff9cf1e600fec700ddcb10529a08ac6346371cc618345b12d164f74097da692a24668979c384508c3c9ec762b7b76c37c5d01b',
    address: '0xE45320E13Df5E6bB1241FD75A42eeB2C9c6312f4',
    isEIP191Prefix: true,
    ret: true,
  },
  {
    message: '0.ag8jy1f5fp5',
    sig: '0x21e23bc1e6426083b738ffaf6c509cfac44326b3774bf4ed5dd034d11a86e3465d1f51cec8ab6e9666961f980bb3cc9013dc6e007e7cd45c88e53f9d632cddb21c',
    address: '0x450E044921c44f9DBEC0841796F3bBf3CB1FAFA6',
    isEIP191Prefix: true,
    ret: true,
  },
  {
    message: '0.qj0ik287dak',
    sig: '0x84367da5b86edd912b444cf3b24cc9956ebc2e26e9aaac307846c20f11d60e2e472b6b90534acf0cfae6c39449183de98d052e7adb0bd5ac456bf6fc4438f3601c',
    address: '0xFAD8Cf692ad014bB8A064C8005e95d7a80232668',
    isEIP191Prefix: true,
    ret: true,
  },
  {
    message: '0.5jrrdhqt2uf',
    sig: '0x362524ead77a75edbd3f4573fcb781338b76d15e89c8647a557fa22c0b3eac5642b203dc0c0b8f47918047f9a8130a3bff47604e737e82bf53a33836e93033f81b',
    address: '0x3E1cdBF698fc4F81F18F08965887b99700420431',
    isEIP191Prefix: true,
    ret: true,
  },
  {
    message: '0.iwdaxskeax',
    sig: '0xfbf22042af070c44c00774536346e290bd65d2de3a31bb91c8a6b63443ab1114554361d11f72f6bc72b4e1b9bac099084493d1c4cdb9852a9c8df2187d14fb1f1c',
    address: '0x0f0FB982a506bf9409196a6Ef7ea85e37F855338',
    isEIP191Prefix: true,
    ret: true,
  },
  {
    message: '0.cpksg7t95qd',
    sig: '0xe881491b2aa3217ff4e1e0c9e42ba7a1cc372cb43378b4ed3a5a7fbcb3f671565b74fcde3245a5fe2a61a5072a185fed6562ea5c3ecae0f9d8f612fa748d8b281b',
    address: '0xCD1B0D0531c6cc725A4B39526BC39739b59dE5A4',
    isEIP191Prefix: true,
    ret: true,
  },
  {
    message: '0.8xyxt7g292e',
    sig: '0x4a010ba4f93d5c0cc3b2b6e12cc5dca3271d940d94d83cf780af90ad6a63e6e76604d649477d06662f70de00ccc0edf5f0e71f63b08cf438c4f738b1950b35cf1c',
    address: '0x1819747E675EC8c5e172768472F4a1259B790F04',
    isEIP191Prefix: true,
    ret: true,
  },
  {
    message: '0.xk3ufl1fim',
    sig: '0xaa31e20c8783684e5b8843ba6f728b81b499d61b43fb5ae68222727654f527d428946d1984cc72e416d30484936ccad1143d4150e669fc1d4461e408a6d60bdc1b',
    address: '0xB22EacdF124F95640e78eA0DD1FA37319EC159A0',
    isEIP191Prefix: true,
    ret: true,
  },
  {
    message: '0.8yi9sz2ldxm',
    sig: '0x6423c904f576a6f6179b82db5e38989a2a6a9e9d1479470473ac559166964fd560503d60d98462baf90d547e38add7452cb9054f5c097c98f671167a80d9cbbc1b',
    address: '0xC3948D8a007a0d4f1891A88Db2c841C2Ac04E44C',
    isEIP191Prefix: true,
    ret: true,
  },
  {
    message: '0.9nj3wupjf2s',
    sig: '0x0ae38eaedf7c890d938033f5394d35f629c5b7412cc35ae52a9901dfb83115643f3393e6bb46afd80310b82eaa96f012cfb64d67344ad31a74ce0aadac38d0291c',
    address: '0xe5AEA2ed111077eA2578701622da9f916492acC7',
    isEIP191Prefix: true,
    ret: true,
  },
  {
    message: '0.5h8te3tf6ln',
    sig: '0x23d135f57a6b52f763596f9106435bb5357ff9856f06dd6b8033f42b0b77813e3fa2c8fa8ef3d008a854a423050d1e55442640d8ad2fcca8f4fd4fb78b6c9f371c',
    address: '0x872EE9674D0f030bf007F6dcE878352D704A3839',
    isEIP191Prefix: true,
    ret: true,
  },
  {
    message: '0.bkmmu2zriro',
    sig: '0x305aec8e4273993b457cd29ec8a1a0f7dc4b1018899054b0b86f6cb46bc824bf76e325884c15c7f7286410516ef2b64ec5001179fbac0417151326d6ffcf00e51c',
    address: '0xe1Cc243FbF9598CC970830E7b0d0878C22C79839',
    isEIP191Prefix: true,
    ret: true,
  },
  {
    message: '0.bm23pu4wj36',
    sig: '0xb77301404b3298f6cfa0ffcacb11b530181e258b63bfe64b61fbf9e9f5cffd473adab562c7d15c495d0538a8b20af5f229578d919168e6b3f6c91e6ed59ac8501b',
    address: '0xf0a478BDbB540b55b07AFdeE1b255E87a0313521',
    isEIP191Prefix: true,
    ret: true,
  },
  {
    message: '0.ttm5i0dmbk',
    sig: '0x35d7a80f8f36f4a568fb7c3ec99e5d663f3db9d81e3565cf0c74f7ea72434cc711faa67584175b29c27d44915f9c71739998d1d8c9d4778907e4570171e662c01b',
    address: '0x372d2cB462542a805cB595f55fb1049C648cD102',
    isEIP191Prefix: true,
    ret: true,
  },
  {
    message: '0.qasi77wog8e',
    sig: '0x1e0103fec75e6ab4b167aa8ee2f1c04f0dc820e25580b39d9d503117707159c71f2a036e2b46123bf5c847ddbea3d3c54d768dcfc64f46248cbd738b1df29f9c1b',
    address: '0xa08c63967f0C0b9eAa5ef8c6FDb015DaF8ccC2a8',
    isEIP191Prefix: true,
    ret: true,
  },
  {
    message: '0.9h4no8i88xj',
    sig: '0x74ff1117aa9d738ef9dabb98a59802f43283144006810f2ef956be609859c7ee11a4f3c0a097238154629ffaf6076f9a2a7e262620f7c963d45bcd46b1f88e0c1c',
    address: '0x66F33bbc82ADa46F0868856C7385EBBB76a04D18',
    isEIP191Prefix: true,
    ret: true,
  },
  {
    message: '0.nnuun9ej9wj',
    sig: '0x8e0dfdc1f3bd16808c2d39f4d466b3ea2c0b5b3ba79c463a318d00dc8f5ac9d8027e105e9873dc09c8e68306a46efd3e2d9baf075d22dd34152fca7db27940121c',
    address: '0x519E37f943FF37aeF09fBfa06c3AF32Bc5182DF7',
    isEIP191Prefix: true,
    ret: true,
  },
  {
    message: '0.uysck554byd',
    sig: '0x8faffc8f9b7f3f710b19743ebd4e585e7c122f1d3db90f56dcaadc197fc9625b1cf612cfa1d79ccd76f59028133ff8bc68c259adc6018929483af65e7b93ed071c',
    address: '0xC339d3D8Df775D7c9127B89c4af69091b8Ead495',
    isEIP191Prefix: true,
    ret: true,
  },
  {
    message: '0.kzx5iyygr2m',
    sig: '0xbe7b41df3ea8cb0bf5640bb552264cd141590f24b1808e712bf9a4eb205fca0076badbf1f73944767723911de84a01fbe4818d2e145f511522fa9d5bb60b8d401c',
    address: '0x42AB05fcB1fE56397AB65657536e6375A0a82d75',
    isEIP191Prefix: true,
    ret: true,
  },
  {
    message: '0.wrao4xwzgy',
    sig: '0x8a8e55494110141850ddb72f0ab8876177bf4a337d250e16f0eedeecf25ae1d429bf2790db7214ea45154223580164a87a433ddce0eec20e14d63a2da38c88fe1b',
    address: '0x15263402F3ed89e7e514047EC8FDA2941F73Bd5E',
    isEIP191Prefix: true,
    ret: true,
  },
  {
    message: '0.2zieu17oqhb',
    sig: '0xd1c981824f14a3c26abe07e940110360231f88120909a4263a35e1fab5c1a8cd58aee23198b29a188ab58baba2d38451a573c23a7817d05610a4e7f0627c87dd1b',
    address: '0xCE5A74D54351eeD0aE9fcA66ED3b241804f75dC4',
    isEIP191Prefix: true,
    ret: true,
  },
  {
    message: '0.5m02n4qxc9e',
    sig: '0x299e9c25f7d69f76b54ba9c3f7f1a48a8f7f50e5e9c6557a1611f9d83f1aed18204b413418b6e10a8dc5d7f710add7e9393b8c6ce7102acf140ddb471c8f9a661c',
    address: '0x185998ac356DcECe8A5B0b91a7EC554fb09757a2',
    isEIP191Prefix: true,
    ret: true,
  },
  {
    message: '0.4wbr5jlbbab',
    sig: '0xc05c10333b108d9c715fba3a3de5c57394bce704166a65dfa185306e8108658954c2891cc50f93d409d007b97f7f46c4c741fea427d390492aed9bbf940c2b331c',
    address: '0x3872275123eE5f84a97553126285082C3cdc9034',
    isEIP191Prefix: true,
    ret: true,
  },
  {
    message: '0.4umvastw8bw',
    sig: '0x1e9278be9a88a619fe5435bb0471418675db8fa5ab77ffa726e8cc2c20e3f56a64602f02a1e29bfd62d786e4a567873fdfca78e6681e8b29d9ed67fff6c26db41b',
    address: '0x28263cbeC4cf741445A278746e469cA50E454224',
    isEIP191Prefix: true,
    ret: true,
  },
  {
    message: '0.rinlmdrytbr',
    sig: '0x1346299aa99090321d67c71e8789b9ad814d34d1a18e00a711abff33b49f6b347ee7654827b69816fd014a1273cba80487c5e1046a6cf12197f6d74fc48d68331c',
    address: '0x4cf17f14C96ABbF9f853e7ed753C0C72D4494F4B',
    isEIP191Prefix: true,
    ret: true,
  },
  {
    message: '0.zgfwmuk6fg',
    sig: '0xdbb31b9a889ac8afa57ab31f0b96ce6b10edca8f23a54298ce483099705b57bc48774e7545bec21d301465dae74f09069bc03b170f205e0fce7d262432c4dd5e1b',
    address: '0x98FcF94952000D6B5f111C0DaA962840953A915D',
    isEIP191Prefix: true,
    ret: true,
  },
  {
    message: '0.34zwejjgxg2',
    sig: '0xcbf31fced663e85f9ba43b72ab4dd86e99fc50e1da50438bde779372b9dcdcd032c520a1dabb328d9ea7334f7e4b36fdcb6350331ee11860b59f9d14684d8e2f1c',
    address: '0xA279681588896b931a07D20B089856a785885f52',
    isEIP191Prefix: true,
    ret: true,
  },
  {
    message: '0.wycsq9m67e',
    sig: '0xa22543070849ae061d5fe539fdaed783cf7802c6b10b153d67b806e739d343f21e3cce9964c9bd6c124344db8030d1c451bfbce725bcb662b1553c4f0f50174b1b',
    address: '0x0a0A541b1fE9cEe91b9E77FA575aA53dECbba46a',
    isEIP191Prefix: true,
    ret: true,
  },
  {
    message: '0.8buig8z4h9b',
    sig: '0x056d2b1529ff2042e65151587579f9551c60fd6259dd7d54236f321867c107f36f704a98bd0556f7f07f8c409032bdf7e8ba5a4e62dd0a4be155f340eb0a61341b',
    address: '0x9B401e24494cd620DD34dF0670A52330B8962713',
    isEIP191Prefix: true,
    ret: true,
  },
  {
    message: '0.96fkbc6pt6h',
    sig: '0xaa94ce07daba17c5a2d74b685b1d92846e31142b44f3b8188f4dd5b57e7935684f897b985b6886eb8dbb407e5afa5799e0a31d06cd599362aad77240150ed8091c',
    address: '0xBEFe4B290cAA295b1213B454223B2BBC59Dd399c',
    isEIP191Prefix: true,
    ret: true,
  },
  {
    message: '0.50e9k6h3gc',
    sig: '0xaebcb6c9fabe7cded1ee9734cb2fa31c34152b299a6f3d58676d52df20e7bc3c2e173da10e2f2ac38875d2c56e22cc117efacbccb1af7788a046603114caa8c71c',
    address: '0x8d08132970fFbcA040668A8f1590B39694365619',
    isEIP191Prefix: true,
    ret: true,
  },
  {
    message: '0.qirsla9uhm',
    sig: '0x2185a66d19899e960e66b2604ee7bf79f3edee2c7d7c937be5d890ed4212dfdc2a2a15181eff1d32d00f6f2d475ec7c3401828d2b0a19f876054e621393ddc9c1c',
    address: '0x2D21986C5451c3039E9771F87C3893587C398F5c',
    isEIP191Prefix: true,
    ret: true,
  },
  {
    message: '0.a8feb5qhmm8',
    sig: '0xd28888a766a0d25e6fccf18ce25ec459a1b2596ea21f9404197a984e5a6c9d5d4adff3f66d07e10d76b952ea17224778946c662c5e1b3ab6972d5e3791cd44901c',
    address: '0x8bb27A5d5b89FDa1E7DF2e3df16c115a90aa9126',
    isEIP191Prefix: true,
    ret: true,
  },
  {
    message: '0.ve884cid7g',
    sig: '0x1802b481a6e0630187c84c1890b2520693fe1341e5bd91aa49d97661eb680b5679f3c4054ffd8fc09689d0d299d6ac4ae248e21bdf3b1cf9f251bbda938ca3f71c',
    address: '0x614bD43D51688130b220CFcCA9aEc1bCbe5E716C',
    isEIP191Prefix: true,
    ret: true,
  },
  {
    message: '0.3phg894g6yc',
    sig: '0x48e13f962899054d1b61d2cf80e9fae0eb5dbc477a576e5670b0890559beb3f9586af28df32b6fca3e060005fbb4168dc75e6d56081a48a8654f76ee78b9a2b81b',
    address: '0x5A9017aF345F143569a4C352D9aa8eA64a7e6354',
    isEIP191Prefix: true,
    ret: true,
  },
  {
    message: '0.otr4be5ohy',
    sig: '0x06769732c55f17bcc24163034a23ea983076da569aea730273ab153384d942e44029ec4e66fbab3ca5cf104b4bc3b2708ef29b287aa48a0280b772b15ca63fea1b',
    address: '0x389A05DfBB01D793a427bF57731177C9387B648B',
    isEIP191Prefix: true,
    ret: true,
  },
  {
    message: '0.if0lzcrl7o',
    sig: '0x5b89c3061aa8545a12f18eff690fd28fcd8fc622c00a052c83e614d3805290f46b6f89e6c3b0635b2badfc2c7fe07a340b3f9ffdb66fc797b818dc20a553b6111b',
    address: '0x374Fd1B29262030Dc3f8264D92D4748170B1E970',
    isEIP191Prefix: true,
    ret: true,
  },
  {
    message: '0.qx5jy7vulud',
    sig: '0x3e6483cbbecb556a79e2d10966811b0f4b002c4dafb2a8831835b5c40f244df53c63b9ed0b7fb9face6f00a49dea9cecedbba650868232dd76b673052c7315061c',
    address: '0x7039404d1375bA7D7c85320619f62a26FF339584',
    isEIP191Prefix: false,
    ret: false,
  },
  {
    message: '0.l0voa84199s',
    sig: '0x9e7e854459df3f91d984fd46af861332257edf8132f2fe9f77be6284e7b8b0a33f3ada872b3cb00a527feb1b8e8836a847276e94c5f39b57998e0f604370a0a71c',
    address: '0x887942659f29E4bF6e9d3663b4c87F64feEa0186',
    isEIP191Prefix: true,
    ret: true,
  },
  {
    message: '0.9i3fxlgk88',
    sig: '0xfa86e36f8dd253f7d79ee1a2b21fb7e6a81268689cfc1b657e7f687e51de82a102cf9fa430dbbcd8c78c78578926e77b2f9606a52c70289d61c28046aabb75e41c',
    address: '0x2E4b032eeD9a25D591cFF965023Ab1b1CDC19b22',
    isEIP191Prefix: true,
    ret: true,
  },
  {
    message: '0.i9fn24qxvb',
    sig: '0x474ccddae1885ee8ae965c517504e820811f569dab338ef3735a77622ed0489146942886de9cad88be4b8a1fb2bce43d79e2359c1b799ac7f11d0d048665e1a41b',
    address: '0x3CFec3ebf3e3F0843d03d380D957465E994D3087',
    isEIP191Prefix: true,
    ret: true,
  },
  {
    message: '0.k5zkuvzsr4',
    sig: '0x82ad8b60c72494edf1a1253c9ce5af91537443bdfd3e897ff6b9ab2a1d5083d6713885161cb12cda3627773ef2818bd64e6fe8f1379f7fd53e131ac51193fc3d1c',
    address: '0x36332B51Ab0066524AeD9F4246198112215FAa0d',
    isEIP191Prefix: true,
    ret: true,
  },
  {
    message: '0.dj6b7csrxcg',
    sig: '0xb7f3901da85e21de1457bb2c148d2a94d3094914120f307c80f92f27b6d557422d3cc9c9963ea6002543d5e68b45c42b5507f41b5630e30c3e8822c42f9229001c',
    address: '0x849a8B8168265b318299b89EBde2Da7F2D19b95a',
    isEIP191Prefix: true,
    ret: true,
  },
  {
    message: '0.via4mfozs9n',
    sig: '0x4d40143eb312066449482898654e355de8cfea3ef54450d7728800af18d668d163f348ce75ca861efbc6a502ce8a656ff77be0a9a721ea7e76cb404cd96f80f21c',
    address: '0x4F034B722EDc8A1ba04D7E720f5bE7aE2cdfD935',
    isEIP191Prefix: true,
    ret: false,
  },
  {
    message: '0.a66b06pf1a',
    sig: '0x778ce0653a92101c207dc6f52a220f4608cc707b0c733d0924cca903b36d28876f6776d5e5f0dd897e300ab32d562caf2ff5dc22f55a01e0a4a6b75f8fe29a081c',
    address: '0xAf0eA0Fd5287F39322d35a7dDA627A619E15CC7a',
    isEIP191Prefix: true,
    ret: false,
  },
  {
    message: '0.9q57svq2z3n',
    sig: '0x99ae2ef87aacbf9763a262f199de5fc25b39114de56336be004af8ebdc67297b55f401fc0cf5bfce2f6dc8c36575a83ee6ebf55aaf991ab133f92d5f401684561b',
    address: '0xAb9b72Df9C65BF97264654b1f7f0c99eD3917857',
    isEIP191Prefix: false,
    ret: false,
  },
  {
    message: '0.172bybzlm2d',
    sig: '0xd97bf775211d4efca5529522fc0943df2241c18cdf50209ae738dcf24f8b1dd11ddfecd7a4e5585fc30dd4259e0b444802d97ea03ad8e4bd6bf8f9a43cf3db1b1c',
    address: '0xd54d866896b58bb1308bb921428b3edb8c840f5d',
    isEIP191Prefix: true,
    ret: true,
  },
  {
    message: '0.g9xsbxlx8z4',
    sig: '0xa0b7b7761f81de7af9ecbfd91d90247f8874a40aafd6db33a2493d6b64d1e5c65fae0c2ed61e0225314dfa42854b58f7a0888c72160784f46a1610d7cf13c1661c',
    address: '0xa8786d9ae113faf1c69fb9593564e8d42511f551',
    isEIP191Prefix: true,
    ret: true,
  },
  {
    message: '0.1bgguxmaxf7',
    sig: '0x5f1199a78864d5bd416e1b91c767d611f953495ca309bd3735bcc6b741ec1ce3118c6668e5f0c09a38f92a9203073a0ac8d040f51ac49b733ae34d7a57b2995f1b',
    address: '0xe8a72eb506dc29dcd4e158f0845ad7e352530fbe',
    isEIP191Prefix: true,
    ret: true,
  },
];

describe('verify signature', () => {
  it('verify eoa signatures', async () => {
    console.log('len = ', test_data.length)
    for (const { message, sig, address, isEIP191Prefix, ret } of test_data) {
      const verifyRet = await verifyMessageSignature(
        message,
        sig,
        address,
        isEIP191Prefix
      );
      expect(verifyRet).toEqual(ret);
    }
  });

  // Message and Signature from UniPassPopupSDK.signMessage with isEIP191Prefix = false
  it('verify contract signature with UniPass prefix', async () => {
    const provider = new providers.JsonRpcProvider(
      'https://rpc.ankr.com/polygon_mumbai'
    );

    const test_data = [
      {
        message: 'Welcome to UniPass!',
        sig: '0x000001d0bdf2f92cfc6de71d00ca5413c19500ae912b215ca680bff55d2c4e971401fd2852989416ea19622985bfb57e341aa7875b17aae708dc0c03375250181ac1da1c020000003c000000640000000002007e7649ccd0315628dabe5256cd050d4ce7e1824d1217dba20cc5e3e5626553970000003c000000000000003c0000c06495b106de8a0701ff5e84d9f8a5c9d711b1b6000000280000000000000000',
        address: '0x6939dBfaAe305FCdA6815ebc9a297997969d39aB',
        isEIP191Prefix: false,
        ret: true,
      },
    ];
    for (const { message, sig, address, isEIP191Prefix, ret } of test_data) {
      const verifyRet = await verifyMessageSignature(
        message,
        sig,
        address,
        isEIP191Prefix,
        provider
      );
      expect(verifyRet).toEqual(ret);
    }
  });

  /* 
   * Message and Signature from UniPassPopupSDK.signMessage with isEIP191Prefix = true
   * All the following npm packages set isEIP191Prefix to true when calling sign message
   * - @unipasswallet/ethereum-provider
   * - @unipasswallet/wagmi-connector 
   * - @unipasswallet/web3-onboard 
   * - @unipasswallet/web3-react 
   * - @unipasswallet/rainbowkit-plugin
  */
  it('verify contract signature with eip191 prefix', async () => {
    const provider = new providers.JsonRpcProvider(
      'https://rpc.ankr.com/polygon_mumbai'
    );

    const test_data = [
      {
        message: 'web3-react test message',
        sig: '0x000001fc53cee27ff7f4312063f162ca6b0eefd4a5b22e9febfcc9225d4fb1f56ba049652ad5509eedb0f67dc4d8f4bf332af376493c8de29d06ff9943d9b18d185fad1c020000003c000000640000000002007e7649ccd0315628dabe5256cd050d4ce7e1824d1217dba20cc5e3e5626553970000003c000000000000003c0000c06495b106de8a0701ff5e84d9f8a5c9d711b1b6000000280000000000000000',
        address: '0x6939dBfaAe305FCdA6815ebc9a297997969d39aB',
        isEIP191Prefix: true,
        ret: true,
      },
    ];
    for (const { message, sig, address, isEIP191Prefix, ret } of test_data) {
      const verifyRet = await verifyMessageSignature(
        message,
        sig,
        address,
        isEIP191Prefix,
        provider
      );
      expect(verifyRet).toEqual(ret);
    }
  });

  it('verify sign typed data sig', async()=>{
    const provider = new providers.JsonRpcProvider(
      "https://rpc.ankr.com/polygon_mumbai"
    );
  
    const typedData = {
      types: {
        EIP712Domain: [
          {
            name: "name",
            type: "string",
          },
          {
            name: "version",
            type: "string",
          },
          {
            name: "chainId",
            type: "uint256",
          },
          {
            name: "verifyingContract",
            type: "address",
          },
        ],
        Person: [
          {
            name: "name",
            type: "string",
          },
          {
            name: "wallet",
            type: "address",
          },
        ],
        Mail: [
          {
            name: "from",
            type: "Person",
          },
          {
            name: "to",
            type: "Person",
          },
          {
            name: "contents",
            type: "string",
          },
        ],
      },
      primaryType: "Mail",
      domain: {
        name: "Ether Mail",
        version: "1",
        chainId: 1,
        verifyingContract: "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC",
      },
      message: {
        from: {
          name: "Cow",
          wallet: "0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826",
        },
        to: {
          name: "Bob",
          wallet: "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB",
        },
        contents: "Hello, Bob!",
      },
    };
  
    const sig =
      "0x0000018e9e9a0bd86c21c33ad96c875f976b9c9fdb78a110536d9b09b74e9d985d2eb04da24f23a78e4c9f281ecdd8869f50a2b5b4e18e4ec78cfcedf3ff3a973fb5dc1c020000003c000000640000000002007e7649ccd0315628dabe5256cd050d4ce7e1824d1217dba20cc5e3e5626553970000003c000000000000003c0000c06495b106de8a0701ff5e84d9f8a5c9d711b1b6000000280000000000000000";
  
    const address = "0x6939dBfaAe305FCdA6815ebc9a297997969d39aB";
  
    try {
      const verifyRet = await verifyTypedDataSignature(typedData, sig, address, provider);
      expect(verifyRet).toEqual(true);
      
    } catch (err) {
      console.log("auth err", err);
    }

  })
});
