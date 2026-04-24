import type { Chapter } from '../../types/novel';

// 第 4 章: 第一次发作,第一次丢脸
// 数据化自 STORY_BIBLE.md §8.3 正文,按 .plan §6 分场景与三处选择。
// 三处选择 (A/B/C) 互锁出 6 种主要走向:
//   A1 (硬撑跟上) -> c4-s2 (重症围观)
//     ├─ B1 嘴硬     -> c4-s3-stubborn -> C1/C2 -> end
//     ├─ B2 让一帆扶 -> c4-s3-helped   -> C1/C2 -> end
//     └─ B3 接知遥水 -> c4-s3-water    -> 转入 c4-s3-helped 后段 -> end
//   A2 (找借口先回) -> c4-s2-light (独自疼一阵)  -> c4-end-light

export const chapter04: Chapter = {
  id: 'ch04',
  index: 4,
  title: '第一次发作,第一次丢脸',
  subtitle: '军训快结束的那几天',
  intro:
    '军训快结束的那几天,太阳和地球贴得没边没沿。你以为最折磨你的是站军姿,可身体准备给你的,是另外一种。',
  startSceneId: 'c4-s1',
  status: 'ready',
  scenes: [
    {
      id: 'c4-s1',
      beats: [
        { id: 'c4-s1-b1', role: 'narration', text: '军训结束前那几天,太阳为了跟地球贴脸,已经完全不要脸了。' },
        { id: 'c4-s1-b2', role: 'narration', text: '操场边一排法桐叶子被烤得卷边发蔫,蹲在树荫下也凉快不到哪儿去——那点影子薄得跟一张被晒透了的旧报纸似的。' },
        { id: 'c4-s1-b3', role: 'narration', text: '教官刚喊了解散,队伍一下子散成几股,男生们像刚从笼屉里端出来的,帽子一摘,衣领一扯,嘴里全是"妈的热死了""快回去洗澡""晚上吃什么"。' },
        { id: 'c4-s1-b4', role: 'narration', text: '王浩然第一个凑过来,手里拎着帽子,后背湿了一大片,还能笑得出来。' },
        { id: 'c4-s1-b5', role: 'other', speaker: '王浩然', text: '晚上出去不出去?我问了,东门那边新开了一家烧烤,搞活动,啤酒买一送一。' },
        { id: 'c4-s1-b6', role: 'other', speaker: '罗展', text: '你别一天到晚就知道烧烤。先回去冲个澡吧,你身上这味儿,狗闻了都得绕着你走。' },
        { id: 'c4-s1-b7', role: 'narration', text: '邓一帆没说话,只低头把迷彩上衣从裤腰里扯出来,站在原地拧开水杯喝了一口。' },
        { id: 'c4-s1-b8', role: 'self', text: '本来想说"去",话到了嘴边,又觉得脚踝那一圈有点说不上来的不对劲。' },
        { id: 'c4-s1-b9', role: 'self', text: '不是疼得厉害,就是涨,像鞋里偷偷塞了一团湿棉花,走路的时候总有点硌。' },
        { id: 'c4-s1-b10', role: 'other', speaker: '王浩然', text: '哎你去不去啊?' },
      ],
      choice: {
        prompt: '脚踝那一圈涨得不对劲,你怎么办?',
        options: [
          {
            id: 'c4-s1-c-push',
            label: '"去啊。" 装没事,跟上去',
            hint: '硬撑↑ 健康↓',
            effects: {
              tendencies: { defiant: 8 },
              health: -3,
              addFlags: ['c4_pushed_through'],
            },
            nextSceneId: 'c4-s2',
          },
          {
            id: 'c4-s1-c-bail',
            label: '"我先回趟宿舍。" 找借口先撤',
            hint: '回避↑ 浩然失望↑ 羞耻↑',
            effects: {
              tendencies: { avoidant: 8 },
              relations: { haoran: -5 },
              shame: 8,
              addFlags: ['c4_bailed_early'],
            },
            nextSceneId: 'c4-s2-light',
          },
        ],
      },
    },

    {
      id: 'c4-s2',
      beats: [
        { id: 'c4-s2-b1', role: 'self', text: '——这还用问。' },
        { id: 'c4-s2-b2', role: 'narration', text: '把帽子往王浩然肩上一扔,"去啊"两个字嘴上比心里硬。不想因为这点不舒服扫兴——军训这半个月已经够烦了,好不容易混进这种热闹,凭什么自己先退出来。' },
        { id: 'c4-s2-b3', role: 'narration', text: '几个人沿着操场边往宿舍区走。人一多,路也显得窄,到处都是迷彩服和拖着步子的脚。教学楼墙上反出来的热气一阵一阵扑到脸上。' },
        { id: 'c4-s2-b4', role: 'narration', text: '走到一半时,那股涨胀感忽然往上窜了一下,像有根筋在关节里猛地拧紧。' },
        { id: 'c4-s2-b5', role: 'narration', text: '脚下一顿,差点没跟上。' },
        { id: 'c4-s2-b6', role: 'other', speaker: '王浩然', text: '怎么了?' },
        { id: 'c4-s2-b7', role: 'other', speaker: '许川', text: '没怎么。鞋磨脚。' },
        { id: 'c4-s2-b8', role: 'narration', text: '王浩然哦了一声,转回去继续和罗展争论晚上要不要加个炒方便面。咬着牙跟上去,结果没走出几步,那种不舒服反而更清楚了。不是简单的酸,是一种又钝又顶的疼,像关节里塞了块发热的石头,每踩一下,石头就往骨头缝里挤一点。' },
        { id: 'c4-s2-b9', role: 'narration', text: '宿舍楼就在前面,白瓷砖墙被太阳烤得发亮。门口乱哄哄一片,蹲着系鞋带的、自拍的、社团学长在边上发传单的——"新生可以了解一下"的招呼声一阵一阵。' },
        { id: 'c4-s2-b10', role: 'narration', text: '沈知遥就是在那时候出现的。她站在一张社团招新的折叠桌旁边,白 T 恤,头发扎起来,手里拿着展板报名表,正低头和旁边的人说话。' },
        { id: 'c4-s2-b11', role: 'self', text: '——之前见过她一次,普通话很好听,跟军训这片躁热的空气不太一样。' },
        { id: 'c4-s2-b12', role: 'narration', text: '本来只是扫了一眼。下一秒,脚腕那里猛地一炸。' },
        { id: 'c4-s2-b13', role: 'narration', text: '不是夸张的天旋地转,也不是电视剧里那种一下跪下去,而是一阵非常具体、非常狼狈的失控。右脚像突然不归自己管了,整个人重心往旁边歪,条件反射地伸手去扶王浩然,结果没扶稳,反倒把对方扯得一个趔趄。' },
        { id: 'c4-s2-b14', role: 'other', speaker: '王浩然', text: '我操,许川你干吗?' },
        { id: 'c4-s2-b15', role: 'narration', text: '周围几个人一下都看了过来。' },
        { id: 'c4-s2-b16', role: 'self', text: '脸刷地热了。' },
        { id: 'c4-s2-b17', role: 'narration', text: '想站直,脚却根本不听使唤,刚一用力,疼就直顶上来,逼得倒抽了一口气。那口气一出来,比喊疼还丢脸。' },
        { id: 'c4-s2-b18', role: 'other', speaker: '王浩然', text: '你没事吧?' },
        { id: 'c4-s2-b19', role: 'other', speaker: '许川', text: '没事。' },
        { id: 'c4-s2-b20', role: 'self', text: '说完自己都知道这两个字站不住脚——脸色已经变了,额头那层汗也不是热出来的。' },
        { id: 'c4-s2-b21', role: 'narration', text: '邓一帆已经走过来,低头看了一眼那只不敢着地的脚,眉头一下皱起来。' },
        { id: 'c4-s2-b22', role: 'other', speaker: '邓一帆', text: '你别动。' },
        { id: 'c4-s2-b23', role: 'other', speaker: '罗展', text: '站麻能疼成这样?' },
        { id: 'c4-s2-b24', role: 'narration', text: '周围人越来越多。有人停下来看两眼,又假装不经意地继续走;有人小声问"怎么了";一个不认识的新生甚至好心地往前凑了一步:' },
        { id: 'c4-s2-b25', role: 'other', speaker: '陌生新生', text: '要不要送医务室?' },
      ],
      choice: {
        prompt: '他们都在等你一句话。',
        options: [
          {
            id: 'c4-s2-c-stubborn',
            label: '"真没事,站麻了。" 嘴硬',
            hint: '硬撑↑↑ 羞耻↑↑ 浩然↓ 一帆↓',
            effects: {
              tendencies: { defiant: 10 },
              shame: 15,
              relations: { haoran: -3, yifan: -5 },
              addFlags: ['c4_refused_clinic'],
            },
            nextSceneId: 'c4-s3-stubborn',
          },
          {
            id: 'c4-s2-c-yifan',
            label: '让一帆扶上楼,不去医务室',
            hint: '坦诚↑ 一帆信任↑↑ 羞耻↑',
            effects: {
              tendencies: { honest: 8 },
              shame: 8,
              relations: { yifan: 12, haoran: 3 },
              addFlags: ['c4_let_yifan_help'],
            },
            nextSceneId: 'c4-s3-helped',
          },
          {
            id: 'c4-s2-c-water',
            label: '接过沈知遥递过来的水,顺势坐下',
            hint: '示弱↑ 知遥好感↑ 羞耻↑',
            effects: {
              tendencies: { honest: 5 },
              shame: 10,
              relations: { shenZhiyao: 6, yifan: 3 },
              addFlags: ['c4_accepted_water'],
            },
            nextSceneId: 'c4-s3-water',
          },
        ],
      },
    },

    // ========== A2 分支:轻症独自版 ==========
    {
      id: 'c4-s2-light',
      beats: [
        { id: 'c4-s2l-b1', role: 'narration', text: '"我先回去趟。"——这句话从嘴里溜出来的时候,自己都觉得借口编得敷衍。' },
        { id: 'c4-s2l-b2', role: 'other', speaker: '王浩然', text: '哥你怎么了,身体不舒服?' },
        { id: 'c4-s2l-b3', role: 'other', speaker: '许川', text: '没,落了个东西在宿舍。你们先去。' },
        { id: 'c4-s2l-b4', role: 'narration', text: '没等他们再追问,转身先走了。背后王浩然又喊了一句什么,没听清。' },
        { id: 'c4-s2l-b5', role: 'narration', text: '一个人慢慢往宿舍楼挪。每一步都像在跟脚踝里那块发热的石头讨价还价。挪到楼道里,确认没人,才扶着扶手停下来。' },
        { id: 'c4-s2l-b6', role: 'narration', text: '楼道里阴一点,可热气一点没少。蹲下来的瞬间,疼终于被允许地涌上来——之前在外面咬着的那口气,在这一刻一下子松掉了。' },
        { id: 'c4-s2l-b7', role: 'self', text: '幸好没人看见。' },
        { id: 'c4-s2l-b8', role: 'self', text: '——这居然是这一刻最强烈的念头。' },
        { id: 'c4-s2l-b9', role: 'narration', text: '楼上有女生说话的脚步声经过,他下意识把脸埋进膝盖里,假装在系鞋带,直到那串脚步走远。' },
        { id: 'c4-s2l-b10', role: 'self', text: '——比被围观更可怕的,是这一刻没人看见。' },
        { id: 'c4-s2l-b11', role: 'self', text: '可这个念头他不能跟任何人说。' },
        { id: 'c4-s2l-b12', role: 'system', text: '——等到疼自己稍稍褪一点,他扶着扶手,一阶一阶往上挪。' },
      ],
      nextSceneId: 'c4-end-light',
    },

    // ========== B1 分支:嘴硬走向 ==========
    {
      id: 'c4-s3-stubborn',
      beats: [
        { id: 'c4-s3s-b1', role: 'other', speaker: '许川', text: '不用。真没事。' },
        { id: 'c4-s3s-b2', role: 'narration', text: '说得比刚才更快,甚至有点凶。可话刚扔出去,脚下一软,整个人没撑住,肩膀"咚"的一声靠到了墙上。声音不大,他却下意识扫了一眼周围——没人没听见。' },
        { id: 'c4-s3s-b3', role: 'other', speaker: '王浩然', text: '你别犟了行不行?' },
        { id: 'c4-s3s-b4', role: 'narration', text: '想甩开,又没甩利索。最丢人的不是疼,是忽然发现自己现在连甩开别人的力气都没有。只能咬着牙,把身体一半重量压在墙上,装得像自己只是站一会儿。' },
        { id: 'c4-s3s-b5', role: 'narration', text: '邓一帆蹲下去看那只脚踝:' },
        { id: 'c4-s3s-b6', role: 'other', speaker: '邓一帆', text: '能踩吗?' },
        { id: 'c4-s3s-b7', role: 'other', speaker: '许川', text: '能。' },
        { id: 'c4-s3s-b8', role: 'other', speaker: '邓一帆', text: '那你踩一个我看看。' },
        { id: 'c4-s3s-b9', role: 'narration', text: '这话说得太直接,一下被噎住。周围居然有人笑了一声,不知道是不是在笑他,反正那笑声像针一样扎进耳朵里。硬着头皮试着往下踩了一点,才一碰地,疼得眉骨都抽了一下,整个人条件反射地又把脚抬起来。' },
        { id: 'c4-s3s-b10', role: 'system', text: '——沉默比起哄更难受。' },
        { id: 'c4-s3s-b11', role: 'other', speaker: '王浩然', text: '……还没事?' },
        { id: 'c4-s3s-b12', role: 'narration', text: '一句都接不上了。能感觉到四周那些目光在自己身上停一下,再滑开,可越是这样,越让人受不了。' },
        { id: 'c4-s3s-b13', role: 'other', speaker: '许川', text: '别去医务室。' },
        { id: 'c4-s3s-b14', role: 'narration', text: '这话出口,自己都听见了那点不对劲——刚才还在跟人犟,到这一句,调子忽然往下掉了一截,听着不像拒绝,倒像在跟谁讨个情面。' },
        { id: 'c4-s3s-b15', role: 'narration', text: '王浩然愣了一下,邓一帆抬头看了一眼,没接话。几秒钟里,周围那些乱哄哄的声音反而更清楚了:楼上有人在喊借过,远处篮球砸地,招新桌边还在发传单。整个学校都照常往前走,只有他一个人卡在原地。' },
        { id: 'c4-s3s-b16', role: 'other', speaker: '邓一帆', text: '那先上楼。' },
        { id: 'c4-s3s-b17', role: 'other', speaker: '王浩然', text: '你把重心给我,别逞强。' },
      ],
      nextSceneId: 'c4-s3-aftermath',
    },

    // ========== B2 分支:让一帆扶 ==========
    {
      id: 'c4-s3-helped',
      beats: [
        { id: 'c4-s3h-b1', role: 'other', speaker: '许川', text: '一帆,你扶我一下。不去医务室,就上楼。' },
        { id: 'c4-s3h-b2', role: 'narration', text: '说出"扶我一下"这四个字,比承认疼还难。可话一旦说出来,身体反而松了一口气——之前那种死撑着的劲松掉了,人差点直接顺着墙滑下去。' },
        { id: 'c4-s3h-b3', role: 'narration', text: '邓一帆没废话,蹲下身,先把那只脚轻轻扶离地面,又抬头跟王浩然说:' },
        { id: 'c4-s3h-b4', role: 'other', speaker: '邓一帆', text: '你扶他左边,我托着这只脚。先挪进楼里。' },
        { id: 'c4-s3h-b5', role: 'other', speaker: '王浩然', text: '行行行。' },
        { id: 'c4-s3h-b6', role: 'narration', text: '王浩然这会儿没了平时那股闹劲,扶得一板一眼。罗展不知道什么时候已经替他把帽子和水杯都拎在手里,跟在边上,什么也没说。' },
        { id: 'c4-s3h-b7', role: 'self', text: '——他们居然没一个人趁机打趣。' },
        { id: 'c4-s3h-b8', role: 'self', text: '这反而让人更想找个地缝钻进去。' },
        { id: 'c4-s3h-b9', role: 'narration', text: '周围有人在看,但被一帆的几句"借过""让一让,谢谢"一带,居然慢慢散开了。' },
      ],
      nextSceneId: 'c4-s3-aftermath',
    },

    // ========== B3 分支:接知遥的水 ==========
    {
      id: 'c4-s3-water',
      beats: [
        { id: 'c4-s3w-b1', role: 'narration', text: '一只手伸到面前,递过来一瓶没开封的水。' },
        { id: 'c4-s3w-b2', role: 'other', speaker: '沈知遥', text: '先坐一下吧。' },
        { id: 'c4-s3w-b3', role: 'narration', text: '是沈知遥。她不知道什么时候走近了,没挤得很前,也没像别人那样一开口就问东问西,只是把水递过来,声音很平。' },
        { id: 'c4-s3w-b4', role: 'self', text: '抬头看了她一眼,第一反应居然不是尴尬,而是更强的难堪。' },
        { id: 'c4-s3w-b5', role: 'self', text: '她看见的不是平时想给人看的那种样子,不是会画图、会说没事、还能撑的样子,而是现在这个站都站不稳、脸色难看、说谎一眼就能被看出来的样子。' },
        { id: 'c4-s3w-b6', role: 'narration', text: '本想说"不用",可她只是看着,声音还是平的:' },
        { id: 'c4-s3w-b7', role: 'other', speaker: '沈知遥', text: '你手都在抖。' },
        { id: 'c4-s3w-b8', role: 'narration', text: '低头看了眼自己接帽子的那只手——确实在抖,很轻,但停不下来。' },
        { id: 'c4-s3w-b9', role: 'narration', text: '她没再说话,把水塞进他手里,又退了半步,轻声补了一句:' },
        { id: 'c4-s3w-b10', role: 'other', speaker: '沈知遥', text: '等会儿再上楼也不迟。' },
        { id: 'c4-s3w-b11', role: 'narration', text: '邓一帆已经蹲下来扶住那只脚,王浩然张了张嘴想说话,被她那一句给压住了——四下围观的人不知道怎么的,也不再凑近。' },
        { id: 'c4-s3w-b12', role: 'self', text: '——他这辈子第一次被一个还不算认识的人替自己挡了一下场子。' },
        { id: 'c4-s3w-b13', role: 'self', text: '这个感觉一时分不清,是感激更多,还是难堪更多。' },
      ],
      nextSceneId: 'c4-s3-aftermath',
    },

    // ========== 三个 B 分支汇合点:楼道里的最后一段 ==========
    {
      id: 'c4-s3-aftermath',
      beats: [
        { id: 'c4-s3a-b1', role: 'narration', text: '楼道里比外面暗一点,热气却一点没少。慢慢往上挪,额角的汗顺着往下掉。' },
        { id: 'c4-s3a-b2', role: 'self', text: '疼都没那么要命。' },
        { id: 'c4-s3a-b3', role: 'self', text: '真正要命的是那种说不清的羞耻——像衣服里进了砂,哪儿都不致命,可哪儿都磨得人难受。' },
        { id: 'c4-s3a-b4', role: 'narration', text: '走到二楼平台时,王浩然忽然拍了下他胳膊,有点笨拙的安慰:' },
        { id: 'c4-s3a-b5', role: 'other', speaker: '王浩然', text: '行了,谁还没个头疼脑热。' },
      ],
      choice: {
        prompt: '浩然在等你一句回应。',
        options: [
          {
            id: 'c4-s3a-c-silent',
            label: '一句不说,继续闷头上楼',
            hint: '回避↑ 浩然好感↓',
            effects: {
              tendencies: { avoidant: 5 },
              relations: { haoran: -5 },
              addFlags: ['c4_silent_to_haoran'],
            },
            nextSceneId: 'c4-end',
          },
          {
            id: 'c4-s3a-c-disclose',
            label: '低声说"以前体检查出过点东西"',
            hint: '坦诚↑↑ 浩然信任↑ 家人隐瞒感↑',
            effects: {
              tendencies: { honest: 10 },
              relations: { haoran: 8, family: -2 },
              addFlags: ['c4_disclosed_to_haoran'],
            },
            nextSceneId: 'c4-end-disclosed',
          },
        ],
      },
    },

    // ========== 主结局:沉默版 ==========
    {
      id: 'c4-end',
      beats: [
        { id: 'c4-end-b1', role: 'narration', text: '没接话。' },
        { id: 'c4-end-b2', role: 'narration', text: '三个人扶着他往楼里走,他甚至不敢回头。他知道有人在看,也知道过了今天,宿舍里、班里、甚至军训结束后随口聊天时,可能都会多出一句:"许川那天是不是脚出问题了?"' },
        { id: 'c4-end-b3', role: 'self', text: '骂的不是疼。' },
        { id: 'c4-end-b4', role: 'self', text: '骂的是——大学才刚开始,他最怕的那件事,好像已经追上来了。' },
      ],
    },

    // ========== 主结局:坦白版 ==========
    {
      id: 'c4-end-disclosed',
      beats: [
        { id: 'c4-end-d-b1', role: 'other', speaker: '许川', text: '我以前体检……查出过点东西。' },
        { id: 'c4-end-d-b2', role: 'narration', text: '声音压得很低,像怕被楼道里的回声放大。' },
        { id: 'c4-end-d-b3', role: 'other', speaker: '王浩然', text: '操,那你早说啊。' },
        { id: 'c4-end-d-b4', role: 'narration', text: '王浩然这一句不重,可比平时所有的玩笑都让人鼻子发酸。' },
        { id: 'c4-end-d-b5', role: 'self', text: '骂的不是疼。' },
        { id: 'c4-end-d-b6', role: 'self', text: '骂的是——这事他刚跟室友说了,可家里那两个人,他到现在还没敢主动开口。' },
      ],
    },

    // ========== 轻症版结局 ==========
    {
      id: 'c4-end-light',
      beats: [
        { id: 'c4-end-l-b1', role: 'narration', text: '回到宿舍,脚踝那块涨痛在床上躺了一个多小时才慢慢淡下去。' },
        { id: 'c4-end-l-b2', role: 'narration', text: '王浩然他们晚饭后才回来,一进门就吵吵着烧烤多油哪个老板娘脾气大。没人提下午的事——因为他们根本不知道。' },
        { id: 'c4-end-l-b3', role: 'self', text: '幸运地躲过了一次围观。' },
        { id: 'c4-end-l-b4', role: 'self', text: '可关上灯之后,他在床上盯着天花板想了很久:' },
        { id: 'c4-end-l-b5', role: 'self', text: '——这一次能躲过去,下一次呢?' },
      ],
    },
  ],
  outroLines: [
    { text: '本章你做出的选择会留在后面的故事里。' },
    { whenFlag: 'c4_pushed_through', text: '硬撑下来的代价,身体会自己记。' },
    { whenFlag: 'c4_bailed_early', text: '没人知道你下午消失去了哪里——这件事你以后可能会需要它,也可能会被它咬一口。' },
    { whenFlag: 'c4_refused_clinic', text: '邓一帆没再说话,但他记住了你那句"真没事"。' },
    { whenFlag: 'c4_let_yifan_help', text: '一帆今晚帮你倒了第二杯水。' },
    { whenFlag: 'c4_accepted_water', text: '沈知遥在朋友圈里点了一条军训照片的赞,没留言。' },
    { whenFlag: 'c4_silent_to_haoran', text: '宿舍熄灯后,浩然只问了一句"睡了没",你没回。' },
    { whenFlag: 'c4_disclosed_to_haoran', text: '王浩然今晚没去夜市,在床上刷手机刷得比平时久。' },
  ],
};
