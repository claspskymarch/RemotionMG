<p align="right"><strong>简体中文</strong> · <a href="#english-overview">English overview ↓</a></p>

# 100 种字体出现方式参考（数学表达 × 创意）

> 本文档用于后续在 **Remotion** 中实现"文字/字体出现动画"时的灵感与公式参考。**本文件只做设计与数学表达，不包含可直接运行的 Remotion 代码。**
>
> 内容分两部分：
> 1. **市面常用方式调研**：先记录业界（GSAP / Framer / Motion / CSS / After Effects / Webflow 等）最常见、最被验证的文字动画类型。
> 2. **100 种出现方式**：在常用方式的基础上，使用尽量多元化的数学表达能力（多项式、指数、对数、三角、双曲、Sigmoid、高斯、模运算、分段、阻尼弹簧、贝塞尔、噪声、随机、极坐标、参数方程、分形、混沌映射等）做创新与扩展。

---

## 〇、符号与约定（Notation）

为了让公式与 Remotion 的"逐帧"模型对齐，统一约定如下：

| 记号 | 含义 |
|------|------|
| `frame` | 当前帧（`useCurrentFrame()`） |
| `fps` | 帧率（`useVideoConfig().fps`） |
| `t` | 归一化进度，`t = clamp((frame - delay) / dur, 0, 1)`，`t ∈ [0,1]` |
| `p` | 经过缓动后的进度，`p = ease(t)`，一般也 `∈ [0,1]` |
| `i` | 第 i 个动画单元（字符 / 词 / 行）索引，从 0 开始 |
| `N` | 单元总数 |
| `u` | 单元的归一化位置 `u = i / max(N-1, 1)`，`u ∈ [0,1]` |
| `τ` | 单元自身的局部进度（考虑 stagger 偏移后）`τ = clamp((t - u·s) / w, 0, 1)`，`s`=交错系数，`w`=窗口宽度 |
| `rand(i)` | 以 i 为种子的确定性伪随机数 `∈ [0,1)`（保证每帧一致，避免闪烁） |
| `noise(x)` | 一维平滑噪声 / Perlin 噪声 `∈ [-1,1]` |
| `lerp(a,b,p)` | 线性插值 `a + (b-a)·p`，对应 Remotion 的 `interpolate` |

> **Remotion 提示**：归一化进度通常用 `interpolate(frame, [in, out], [0, 1], {extrapolateLeft:'clamp', extrapolateRight:'clamp'})` 得到；物理弹簧用 `spring({frame, fps, config})`；`Easing` 模块提供 `Easing.bezier / elastic / bounce / cubic ...`。

---

## 一、市面常用方式调研（业界基线）

下列为各大动效工具（GSAP、Framer Motion、Webflow、After Effects、Vertex、shadcn 等）中**最常被使用、最被验证**的文字出现方式，作为后续创新的基线：

1. **Fade In（淡入）**：`opacity 0→1`，最通用、"无形"的基线动画。
2. **Slide / Translate In（位移滑入）**：从上/下/左/右带位移淡入（`translateY: 50→0`）。
3. **Scale / Pop In（缩放弹出）**：`scale 0.8→1`，常配弹簧产生 Q 弹效果。
4. **Typewriter（打字机）**：逐字符按时间窗依次出现，左到右"打字"。
5. **Stagger / Cascade（交错级联）**：每个字符/词/行带递增时间偏移，形成波浪式入场。
6. **Blur In（模糊聚焦）**：`blur(12px)→0`，从虚到实。
7. **Motion Blur Slide（运动模糊滑入）**：滑入时带速度方向模糊，更有"重量与速度感"。
8. **Bounce / Spring（弹跳/弹簧）**：带过冲与回弹的物理入场。
9. **Color Transition / Lerp（颜色过渡）**：颜色随进度插值，制造情绪弧线。
10. **Clip-path / Wipe Reveal（裁剪揭示）**：用遮罩矩形/形状擦出文字。
11. **Mask / Line Reveal（行遮罩上推）**：文字从一条基线下方被推出（overflow hidden）。
12. **Scramble / Decode（乱码解码）**：字符在随机字形间快速跳动后"解码"为最终字。
13. **Variable Font Animation（可变字体）**：动态改变 `font-weight / wght / wdth` 等轴。
14. **3D / Perspective Flip（三维翻转）**：`rotateX / rotateY` 配 `perspective`。
15. **Wave（正弦波）**：字符沿正弦曲线连续起伏。
16. **Glitch（故障）**：RGB 分离 + 抖动 + 横向撕裂。
17. **Shatter / Scatter（破碎/飞散）**：字符碎成碎片飞散或聚合。
18. **Liquid / Morph（液态/形变）**：SVG goo 滤镜让字母粘连流动。
19. **Particle Dissolve（粒子溶解）**：文字由粒子聚合或溶解。
20. **Shimmer / Gradient Sweep（流光扫光）**：高光渐变横扫文字。

> 以下 100 种在这些基线之上，主要通过**更换数学表达**与**叠加创意**进行系统化扩展。每条都标注：效果 / 数学表达 / 创意变体。

---

## 二、100 种字体出现方式

### A. 透明度 · 多项式与指数曲线类（1–10）

#### 1. 线性淡入（Linear Fade）
- **效果**：最朴素的透明度渐显。
- **数学表达**：`opacity = t`（即 `lerp(0,1,t)`）。
- **创意/变体**：作为一切动画的"地板"，可叠加任意位移。

#### 2. 二次淡入（Quadratic Ease-In Fade）
- **效果**：开头慢、结尾快的淡入。
- **数学表达**：`opacity = t²`。
- **创意/变体**：用于"逐渐被点亮"的感觉；`t^n` 提高 n 让起步更迟缓。

#### 3. 三次缓出淡入（Cubic Ease-Out）
- **效果**：迅速出现后柔和收尾，最"高级感"的默认曲线。
- **数学表达**：`opacity = 1 - (1 - t)³`。
- **创意/变体**：配 `translateY` 做经典标题入场。

#### 4. 指数冲入（Exponential Ease-Out）
- **效果**：瞬间冲到接近满，再缓慢逼近。
- **数学表达**：`opacity = 1 - 2^(-10t)`（`t=1` 时取 1）。
- **创意/变体**：科技感"信号锁定"；配合轻微缩放。

#### 5. 对数渐显（Logarithmic Reveal）
- **效果**：起步极快、后段拖尾，像墨水扩散到极限。
- **数学表达**：`opacity = ln(1 + (e-1)·t)`。
- **创意/变体**：适合"呼吸式"出现，末端几乎察觉不到变化。

#### 6. Sigmoid 渐显（Logistic S-Curve）
- **效果**：两端平滑、中间陡峭的 S 形淡入，非常自然。
- **数学表达**：`opacity = 1 / (1 + e^(-k(t-0.5)))`，`k≈12` 控制陡度。
- **创意/变体**：调 `k` 在"硬切"和"丝滑"之间连续过渡。

#### 7. 高斯脉冲闪现（Gaussian Flash-In）
- **效果**：先过曝高亮一瞬，再回落到正常，像闪光灯定格。
- **数学表达**：亮度 `b = 1 + A·e^(-((t-μ)²)/(2σ²))`，`μ≈0.3`。
- **创意/变体**：把 `b` 作用于 `filter: brightness()` 或白色叠层透明度。

#### 8. 伽马校正淡入（Gamma Fade）
- **效果**：感知更均匀的淡入（修正人眼对暗部敏感）。
- **数学表达**：`opacity = t^(1/2.2)`。
- **创意/变体**：当线性淡入"看起来后半段太快"时改用它。

#### 9. 双指数过冲（Bi-Exponential Overshoot）
- **效果**：先冲过 1（过曝/放大），再回稳。
- **数学表达**：`v = (1 - e^(-at)) · (1 + b·e^(-ct))`。
- **创意/变体**：把 `v` 同时驱动透明度与缩放，得到"爆点"。

#### 10. 幂律阶梯淡入（Power-Step Fade）
- **效果**：分段加速的渐显，像分级点亮。
- **数学表达**：`opacity = floor(t·k)/k`，再对每段套 `t^2`。
- **创意/变体**：`k` 段数越多越平滑，越少越"机械"。

---

### B. 位移 · 缓动与方向类（11–20）

#### 11. 上移淡入（Slide-Up Fade）
- **效果**：从下方 50px 升入并淡入，最常用标题动画。
- **数学表达**：`y = lerp(50, 0, easeOutCubic(t))`，`opacity = t`。
- **创意/变体**：方向换成左右/斜向即得系列变体。

#### 12. 回退超调滑入（Back Ease / Anticipation）
- **效果**：先反向退一点再冲入，带"预备动作"。
- **数学表达**：`easeOutBack(t) = 1 + c₃(t-1)³ + c₁(t-1)²`，`c₁=1.70158`。
- **创意/变体**：过冲量由 `c₁` 调；适合俏皮品牌。

#### 13. 弹性滑入（Elastic Slide）
- **效果**：到位后像橡皮筋来回振荡几次。
- **数学表达**：`easeOutElastic(t) = 2^(-10t)·sin((10t-0.75)·2π/3) + 1`。
- **创意/变体**：减小振幅做"轻微回弹"，加大做"果冻"。

#### 14. 重力下坠落定（Gravity Drop）
- **效果**：从上方自由落体砸到基线。
- **数学表达**：`y = y₀ - ½·g·(t·T)²`（落体），到底夹紧。
- **创意/变体**：落地配 1–2 次 `easeOutBounce` 回跳。

#### 15. 抛物线抛入（Projectile Toss）
- **效果**：沿抛物线从屏外抛入到位。
- **数学表达**：`x = lerp(x₀,x₁,t)`，`y = y₁ + h·4t(1-t)`（抛物顶点在中段）。
- **创意/变体**：像"投掷"标题，配旋转 `rotate = lerp(-30,0,t)`。

#### 16. 阻尼回正滑入（Damped Settle）
- **效果**：冲过头后以指数衰减振荡回到 0。
- **数学表达**：`y = A·e^(-ζω t)·cos(ω√(1-ζ²)·t)`，到位即停。
- **创意/变体**：`ζ`（阻尼比）控制"几次回弹"；接近临界阻尼最干净。

#### 17. 速度模糊滑入（Motion-Blur Slide）
- **效果**：滑入越快、模糊越重，停下变清晰。
- **数学表达**：速度 `v = d/dt(easeOut(t))`；`blur = k·|v|`。
- **创意/变体**：方向模糊（`filter: blur` + 拉伸 `scaleX`）更有冲刺感。

#### 18. 惯性甩入（Inertia Whip）
- **效果**：高速甩入再急刹，末端轻微回弹。
- **数学表达**：位置用 `easeOutExpo`，叠加末段小幅 `sin` 余震。
- **创意/变体**：配 `skewX` 制造"被甩弯"的速度线。

#### 19. 磁吸归位（Magnetic Snap）
- **效果**：四散的字符像被磁铁吸到目标位。
- **数学表达**：每帧 `pos += (target - pos)·k`（指数趋近，`k∈(0,1)`）。
- **创意/变体**：初始位置用 `rand(i)` 散布，吸附速度按距离加权。

#### 20. 多段路径折线入场（Polyline Path-In）
- **效果**：沿多个关键点折线运动后到位。
- **数学表达**：`interpolate(t, [0,.4,.7,1], [起,拐1,拐2,终])` 分段插值。
- **创意/变体**：模拟"路径动画"，可做 L 形、Z 形入场。

---

### C. 缩放 · 形变类（21–30）

#### 21. 弹簧弹出（Spring Pop）
- **效果**：`scale 0→1` 带 Q 弹过冲，最讨喜的入场。
- **数学表达**：Remotion `spring({frame, fps, config:{damping, stiffness, mass}})`。
- **创意/变体**：低 damping = 更弹；配透明度做"啵"地出现。

#### 22. 各向异性挤压（Squash & Stretch）
- **效果**：出现瞬间先横向压扁再回弹，迪士尼动画原则。
- **数学表达**：`scaleX = 1 + A·e^(-kt)·cos(ωt)`，`scaleY = 1/scaleX`（保体积）。
- **创意/变体**：体积守恒让形变更可信。

#### 23. 旋转缩放螺入（Rotate-Zoom Spiral）
- **效果**：一边放大一边旋转着冲到正位。
- **数学表达**：`scale = t`，`rotate = lerp(180°, 0°, easeOut(t))`。
- **创意/变体**：负角度做反向螺旋；配模糊更眩晕。

#### 24. 透视纵深推入（Z-Push Perspective）
- **效果**：从远处（小且模糊）沿 Z 轴推到眼前。
- **数学表达**：`translateZ = lerp(-800, 0, easeOut(t))`，配 `perspective`。
- **创意/变体**：远端加雾化 `blur`，近端清晰。

#### 25. 焦点拉近（Dolly Zoom 文字版）
- **效果**：缩放与透视反向变化，产生"眩晕变焦"。
- **数学表达**：`scale↑` 同时 `perspective↓`，保持主体大小、背景错位。
- **创意/变体**：希区柯克式紧张感开场。

#### 26. 翻牌立体出现（3D Card Flip）
- **效果**：绕 X/Y 轴翻转 90°→0° 露出文字。
- **数学表达**：`rotateY = lerp(90°, 0°, easeOutCubic(t))`，`backface hidden`。
- **创意/变体**：逐字符 stagger 翻牌像"翻页字幕"。

#### 27. 折纸展开（Origami Unfold）
- **效果**：文字像被折叠后逐段展开。
- **数学表达**：每段 `rotateX` 从 ±90° 收到 0°，分段相位差。
- **创意/变体**：上下交替折叠方向更像手风琴。

#### 28. 镜像对开（Mirror Split Open）
- **效果**：上下/左右两半从中线分开露出文字。
- **数学表达**：上半 `y: -h→0`，下半 `y: +h→0`，`easeInOut`。
- **创意/变体**：配中线一道高光扫过。

#### 29. 厚度生长（Extrude Grow）
- **效果**：文字"长出"3D 厚度（多层投影叠加）。
- **数学表达**：第 k 层偏移 `(k·dx, k·dy)`，层数 `K = round(maxK·t)`。
- **创意/变体**：层间渐变色做霓虹立体字。

#### 30. 弹性拉伸归位（Elastic Stretch）
- **效果**：先被拉得很长很扁，再弹回正常比例。
- **数学表达**：`scaleY = 1 + (S-1)·easeOutElastic(t)` 反向。
- **创意/变体**：纵向拉伸="惊讶"，横向=滑稽。

---

### D. 模糊 · 滤镜类（31–38）

#### 31. 模糊聚焦（Blur-to-Focus）
- **效果**：从一片模糊逐渐对焦清晰。
- **数学表达**：`blur = lerp(16, 0, easeOutCubic(t))` px。
- **创意/变体**：配轻微 `scale 1.05→1` 像镜头对焦。

#### 32. 失焦呼吸（Focus Breathing）
- **效果**：在清晰前来回失焦两次再锁定。
- **数学表达**：`blur = |sin(πt·n)|·A·(1-t)`。
- **创意/变体**：模拟自动对焦"拉风箱"。

#### 33. 墨水晕染（Ink Bleed）
- **效果**：极重模糊 + 缩放，像墨滴在纸上化开成字。
- **数学表达**：`blur = 20·(1-t)^2`，`scale = lerp(0.9,1,t)`。
- **创意/变体**：配纸张噪声纹理与轻微透明度。

#### 34. 辉光绽放（Glow Bloom）
- **效果**：出现时强发光后收敛为正常描边。
- **数学表达**：`textShadow blur = A·e^(-kt)`，亮度同步衰减。
- **创意/变体**：霓虹灯"通电点亮"感。

#### 35. 色差散焦（Chromatic Aberration In）
- **效果**：RGB 三通道先错位模糊，收拢对齐成清晰字。
- **数学表达**：通道偏移 `Δ = D·(1-t)`，R/-、B/+ 反向。
- **创意/变体**：偏移量加微抖动→赛博故障味。

#### 36. 半调网点显影（Halftone Develop）
- **效果**：由粗网点逐渐细化成实心字。
- **数学表达**：网点半径 `r = R·(1-t)`，覆盖率 `= t`。
- **创意/变体**：报纸/丝印复古风。

#### 37. 像素化解析（Pixelate Resolve）
- **效果**：从大马赛克块逐步解析到清晰字形。
- **数学表达**：像素块尺寸 `b = round(B·(1-t)) + 1`。
- **创意/变体**：8-bit 游戏读取感；配扫描行。

#### 38. 热浪扭曲显现（Heat-Haze Reveal）
- **效果**：透过热空气般扭动着浮现，再稳定。
- **数学表达**：位移 `= noise(x·f + t)·A·(1-t)`（位移随进度衰减）。
- **创意/变体**：沙漠/火焰场景标题。

---

### E. 三角函数 · 波动类（39–50）

#### 39. 正弦行波（Traveling Sine Wave）
- **效果**：字符沿正弦曲线依次起伏出现。
- **数学表达**：`y = A·sin(2π·f·u - ω·t)`，相位随 `u` 推进。
- **创意/变体**：振幅随 `t` 衰减则波浪最终归零。

#### 40. 余弦摆入（Cosine Pendulum）
- **效果**：像钟摆从一侧摆到中位停下。
- **数学表达**：`rotate = θ₀·cos(ω t)·e^(-kt)`（阻尼摆）。
- **创意/变体**：悬挂式 banner 入场。

#### 41. 驻波涟漪（Standing-Wave Ripple）
- **效果**：从中心向两端的驻波让字符上下振荡显形。
- **数学表达**：`y = A·sin(k·u)·cos(ω t)·(1-t)`。
- **创意/变体**：对称感强，适合 logo 字。

#### 42. 心跳脉动出现（Heartbeat Pulse）
- **效果**：以心跳节律一缩一放地"扑通"出现。
- **数学表达**：`scale = 1 + A·(sin(ωt)+0.5·sin(2ωt))·e^(-kt)`。
- **创意/变体**：双峰波形更像真实心跳。

#### 43. 正切骤变弹出（Tangent Snap）
- **效果**：接近临界点时位置急剧变化的"啪"地出现。
- **数学表达**：`y = A·tan((t-0.5)·θ)`（限幅）。
- **创意/变体**：极端非线性 → 强烈"卡点"。

#### 44. 李萨如轨迹聚合（Lissajous Gather）
- **效果**：字符沿李萨如曲线游走后收敛到位。
- **数学表达**：`x = A·sin(a·φ+δ)·(1-t)`，`y = B·sin(b·φ)·(1-t)`。
- **创意/变体**：不同 `a:b` 比得到多种缠绕轨迹。

#### 45. 阻尼正弦定格（Damped Sine Settle）
- **效果**：上下抖动逐渐衰减后定格（弹簧的解析版）。
- **数学表达**：`y = A·e^(-ζt)·sin(ω t + φ)`。
- **创意/变体**：与 #16 同源，作用于不同属性。

#### 46. 双正弦拍频闪烁（Beat-Frequency Flicker）
- **效果**：两个相近频率叠加形成"忽明忽暗"的拍频后稳定。
- **数学表达**：`opacity = 0.5+0.5·cos(2π·f₁t)·cos(2π·f₂t)`，`f₁≈f₂`。
- **创意/变体**：灯管"将亮未亮"的迟疑感。

#### 47. 螺旋极坐标入场（Polar Spiral-In）
- **效果**：字符从外圈沿阿基米德螺旋旋入中心排好。
- **数学表达**：`r = R(1-t)`，`θ = θ₀ + k·t`；`x=r cosθ, y=r sinθ`。
- **创意/变体**：对数螺旋 `r=a·e^(bθ)` 更自然。

#### 48. 波纹扩散显影（Ripple Expand）
- **效果**：以某字符为圆心，显形按到圆心距离的同心波纹推开。
- **数学表达**：单元延迟 `delay = dist(i, center)·c`，再各自淡入。
- **创意/变体**：点击/落点处"水波纹"揭示。

#### 49. 旗帜飘动落定（Flag Wave Settle）
- **效果**：整段文字像旗帜在风中波动后逐渐平整。
- **数学表达**：`y = A·sin(k·u - ωt)·(1-t)`，`skew` 随斜率联动。
- **创意/变体**：加二次谐波让飘动更随机。

#### 50. 摆线滚入（Cycloid Roll-In）
- **效果**：字符沿摆线（滚动圆上一点轨迹）滚动入场。
- **数学表达**：`x = R(φ - sinφ)`，`y = R(1 - cosφ)`，`φ: 0→2π·t`。
- **创意/变体**：像"滚动的轮子"带字进场。

---

### F. 逐字符 · 交错编排类（51–62）

#### 51. 打字机（Typewriter）
- **效果**：逐字符按等时窗出现，可带光标闪烁。
- **数学表达**：可见字符数 `n = floor(t·N)`；第 i 字 `visible = i < n`。
- **创意/变体**：等宽字体 + `|` 光标 `opacity = step(sin(ωt))`。

#### 52. 线性交错级联（Linear Stagger）
- **效果**：从左到右每字延迟递增地淡入上移。
- **数学表达**：`delay(i) = i·d`；`τ = clamp((t - i·d)/w, 0,1)`。
- **创意/变体**：`from:'center' / 'edges' / 'random'` 改变起点。

#### 53. 居中向外开花（Center-Out Bloom）
- **效果**：从中间字符向两侧依次绽开。
- **数学表达**：`delay(i) = |i - N/2|·d`。
- **创意/变体**：配 `scale` 弹出像"绽放"。

#### 54. 随机乱序浮现（Random Stagger）
- **效果**：字符以打乱的随机顺序逐个出现。
- **数学表达**：`delay(i) = rand(i)·D`（种子固定，避免闪烁）。
- **创意/变体**：像"碎片信息逐渐拼齐"。

#### 55. 高斯权重交错（Gaussian-Weighted Stagger）
- **效果**：中部字符先出、两端最后，节奏呈钟形。
- **数学表达**：`delay(i) ∝ 1 - e^(-((u-0.5)²)/(2σ²))`。
- **创意/变体**：σ 控制"聚焦中心"的强弱。

#### 56. 波浪逐字起伏（Per-Char Wave）
- **效果**：每个字符以相位差做正弦上下浮现。
- **数学表达**：`y(i) = A·sin(ωt - i·Δφ)·(1-t)`。
- **创意/变体**：经典 GSAP "per-char wave with color"。

#### 57. 多米诺翻倒（Domino Topple）
- **效果**：字符像多米诺骨牌依次翻倒立正。
- **数学表达**：`rotate(i) = 90°·(1 - clamp((t - i·d)/w,0,1))`，绕底边。
- **创意/变体**：翻倒方向交替 → 更有机。

#### 58. 字间距收拢（Letter-Spacing Collapse）
- **效果**：字符从极宽间距收拢到正常字距。
- **数学表达**：`letterSpacing = lerp(W, 0, easeOut(t))`，配淡入。
- **创意/变体**：反向（展开）做"呼吸"标题。

#### 59. 逐行上推遮罩（Line-by-Line Mask Up）
- **效果**：多行文本逐行从下方遮罩中被推出。
- **数学表达**：每行 `y: 100%→0`（overflow hidden），行延迟 `= row·d`。
- **创意/变体**：影视字幕、引言段落标配。

#### 60. 词级弹入（Word Pop Stagger）
- **效果**：以"词"为单位依次弹入（比逐字更稳重）。
- **数学表达**：单元=词，`delay(w)=w·d` + spring scale。
- **创意/变体**：长句用词级、短标题用字级。

#### 61. 卷帘百叶（Vertical Blinds）
- **效果**：每个字符像百叶窗 `scaleX 0→1` 从边缘展开。
- **数学表达**：`scaleX(i) = clamp((t - i·d)/w, 0, 1)`，`from:'edges'`。
- **创意/变体**：横向百叶用 `scaleY`。

#### 62. 蛇形蜿蜒进场（Boustrophedon Snake）
- **效果**：多行文本按"S 形"（奇偶行反向）依次点亮。
- **数学表达**：序号 `k` 按行蛇形重排后 `delay = k·d`。
- **创意/变体**：像古代"牛耕式"阅读顺序，独特节奏。

---

### G. 裁剪 · 遮罩揭示类（63–70）

#### 63. 横向擦除（Horizontal Wipe）
- **效果**：遮罩从左到右擦出文字。
- **数学表达**：`clipPath: inset(0 (100·(1-p))% 0 0)`。
- **创意/变体**：擦除边缘加一道亮线/渐变羽化。

#### 64. 对角斜切揭示（Diagonal Reveal）
- **效果**：沿对角线方向揭开。
- **数学表达**：`clipPath: polygon(...)` 顶点随 `p` 平移。
- **创意/变体**：斜角度可调，配运动模糊更利落。

#### 65. 圆形光圈揭示（Circular Iris）
- **效果**：从一点圆形扩张露出文字（老电影光圈）。
- **数学表达**：`clipPath: circle(${lerp(0,150,p)}% at cx cy)`。
- **创意/变体**：圆心可设在某字符或鼠标落点。

#### 66. 块状马赛克揭示（Mosaic Block Reveal）
- **效果**：网格小块按随机/扫描顺序逐块点亮拼出字。
- **数学表达**：块 (r,c) 延迟 `= rand(r,c)·D` 或 `(r+c)·d`。
- **创意/变体**：对角扫描 = 数据加载感。

#### 67. 扫描线显影（Scanline Develop）
- **效果**：一条扫描线上下移动，扫过处显形。
- **数学表达**：可见条件 `y_char < lerp(0, H, t)`，线处加亮。
- **创意/变体**：CRT/全息投影质感。

#### 68. 形状蒙版生长（SVG Mask Grow）
- **效果**：用任意 SVG 形状作为遮罩逐渐放大露字。
- **数学表达**：mask 形状 `scale = p` 或路径 `stroke-dashoffset` 推进。
- **创意/变体**：用品牌图形当揭示蒙版。

#### 69. 笔画手写（Stroke-by-Stroke Handwriting）
- **效果**：沿字形笔画路径"书写"出现（SVG 描边）。
- **数学表达**：`strokeDashoffset = L·(1-p)`（`L`=路径总长）。
- **创意/变体**：手写体签名最佳；笔尖加光点。

#### 70. 液面上涨填充（Liquid Fill Up）
- **效果**：文字像容器被液体从底部灌满显色。
- **数学表达**：填充高度 `= lerp(0, glyphH, p)`，配正弦液面波动。
- **创意/变体**：液面波纹 `+ A·sin(kx+ωt)`，更像真水。

---

### H. 噪声 · 随机 · 概率类（71–80）

#### 71. 噪声抖动收敛（Noise Jitter Settle）
- **效果**：字符随机抖动幅度随进度衰减直至静止。
- **数学表达**：`offset = noise(i, t·f)·A·(1-t)`。
- **创意/变体**：抖动各向异性可做"紧张/寒冷"情绪。

#### 72. 乱码解码（Scramble / Decode）
- **效果**：字符在随机字形间快速跳变，逐个"解码"为正确字。
- **数学表达**：第 i 字锁定时间 `lock(i)=i·d`；未锁定时显示 `randomGlyph(frame)`。
- **创意/变体**：用专属字符集（如片假名）做"黑客帝国"。

#### 73. 沙化重组（Sand Reform）
- **效果**：一堆随机散点粒子向字形目标点收敛成字。
- **数学表达**：`pos_k = lerp(rand_start_k, target_k, easeOut(t))`。
- **创意/变体**：反向 = 字"扬沙"消散。

#### 74. 概率点亮（Stochastic Light-Up）
- **效果**：每个字符以随进度上升的概率被点亮，最终全亮。
- **数学表达**：第 i 字亮 ⇔ `rand(i) < t`。
- **创意/变体**：闪烁式不确定感，像"信号逐渐稳定"。

#### 75. 布朗运动漂入（Brownian Drift-In）
- **效果**：字符做随机游走逐渐漂到目标位。
- **数学表达**：`pos += randn()·σ(1-t)`，叠加向目标的漂移项。
- **创意/变体**：尘埃/微生物般的有机运动。

#### 76. 泊松雨滴落字（Poisson Rain）
- **效果**：字符按泊松到达时间像雨点随机砸下。
- **数学表达**：到达间隔 `~ Exp(λ)`，累积时间触发各字落定。
- **创意/变体**：配落地涟漪 #48。

#### 77. 噪声场流入（Curl-Noise Flow）
- **效果**：字符沿旋度噪声向量场流动后归位。
- **数学表达**：速度 `v = curl(noise(x,y))·(1-t)`。
- **创意/变体**：烟雾/流体般优雅汇聚。

#### 78. 信号噪声比上升（SNR Rise）
- **效果**：从"雪花噪点中隐约的字"到"纯净清晰"。
- **数学表达**：`显示 = lerp(noiseTexture, glyph, t)`；噪点密度 `∝(1-t)`。
- **创意/变体**：电视调台、卫星接收画面。

#### 79. 抖动溶解显影（Dither Dissolve）
- **效果**：用有序抖动矩阵阈值控制像素逐步显形。
- **数学表达**：像素显 ⇔ `bayer(x,y) < t`。
- **创意/变体**：复古 1-bit 溶解转场。

#### 80. 量子叠加坍缩（Quantum Collapse）
- **效果**：字符同时"虚影叠加"在多个位置，最终坍缩到一个。
- **数学表达**：多副本透明度 `= softmax` 随 `t` 集中到目标副本。
- **创意/变体**：科幻/概率主题片头。

---

### I. 粒子 · 分解重组类（81–88）

#### 81. 粒子聚合成字（Particle Assemble）
- **效果**：四散粒子飞入拼成字形。
- **数学表达**：每粒 `pos = lerp(spawn_k, glyphSample_k, easeOut(t))`。
- **创意/变体**：粒子大小/透明度随接近度变化。

#### 82. 破碎飞散逆放（Reverse Shatter）
- **效果**：碎片从屏外旋转飞入"拼回"完整字（破碎的倒放）。
- **数学表达**：碎片 `i`：`pos=lerp(scatter_i,0,p)`，`rotate=lerp(θ_i,0,p)`。
- **创意/变体**：`scatter_i`、`θ_i` 用 `rand(i)` 固定种子。

#### 83. 爆炸冲击波成形（Shockwave Form）
- **效果**：中心爆点冲击波过处把粒子定形为字。
- **数学表达**：波前半径 `R(t)`；`dist<R` 的粒子开始归位。
- **创意/变体**：波前加亮环 + 轻微镜头震动。

#### 84. 烟雾凝结（Smoke Condense）
- **效果**：弥散烟雾团逐渐凝聚出清晰字形。
- **数学表达**：模糊+扩散半径 `∝(1-t)`，透明度向字形掩膜收敛。
- **创意/变体**：配 curl-noise #77 让烟更真实。

#### 85. 磁粉吸附（Ferrofluid Pull）
- **效果**：黑色磁流体液滴被磁场拉扯成尖刺状字形。
- **数学表达**：表面位移沿法线 `= spikes·noise·p`，goo 滤镜粘连。
- **创意/变体**：暗黑科技感 logo。

#### 86. 体素堆叠（Voxel Stack-Up）
- **效果**：小方块从底部逐层堆叠搭出 3D 字。
- **数学表达**：体素 (x,y,z) 出现延迟 `= (y + rand)·d`，落体到位。
- **创意/变体**：像《我的世界》搭字。

#### 87. 链条拉链合拢（Zipper Merge）
- **效果**：左右两组半片字像拉链交替咬合成完整字。
- **数学表达**：奇偶片 `x = ±X·(1-easeInOut(t))`，交错延迟。
- **创意/变体**：中缝高光闪一下。

#### 88. 细胞分裂增殖（Mitosis Spawn）
- **效果**：一个点分裂复制、增殖铺满字形。
- **数学表达**：可见单元数 `= min(N, 2^(floor(t·k)))`（指数增殖）。
- **创意/变体**：生物/医疗主题。

---

### J. 颜色 · 光影类（89–94）

#### 89. 色相旋转入场（Hue-Rotate In）
- **效果**：出现时色相飞速旋转最终落到目标色。
- **数学表达**：`hue = lerp(360°·n, targetHue, easeOut(t))`。
- **创意/变体**：配饱和度 `0→100%` 像"通电上色"。

#### 90. 流光扫光（Gradient Sweep / Shimmer）
- **效果**：一道高光渐变横扫文字，扫过处点亮。
- **数学表达**：渐变位置 `bgPos = lerp(-100%, 200%, t)`，`background-clip:text`。
- **创意/变体**：金属/玻璃质感标题循环高光。

#### 91. 温度冷暖渐变（Blackbody Warm-Up）
- **效果**：像金属受热从暗红→橙→白地"烧"出字。
- **数学表达**：颜色沿黑体辐射色温曲线 `T(t)` 映射。
- **创意/变体**：配辉光 #34 = 熔炉点亮。

#### 92. 阴影投射成形（Long-Shadow Cast）
- **效果**：先出现长投影，再"落"出实体字。
- **数学表达**：投影长度 `L = lerp(Lmax, L0, p)`，主体透明度 `= p`。
- **创意/变体**：扁平化长投影风。

#### 93. 光照扫掠浮雕（Lighting Sweep Emboss）
- **效果**：一束方向光扫过，按法线产生浮雕高光/阴影显形。
- **数学表达**：亮度 `= max(0, N·L(t))`，光向 `L` 随 `t` 旋转。
- **创意/变体**：石刻/金属雕刻揭示。

#### 94. 霓虹逐段点亮（Neon Tube Sequential）
- **效果**：霓虹管按笔画分段"啪啪"通电点亮，带迟疑闪烁。
- **数学表达**：段 k 点亮时间 `= k·d`，点亮瞬间叠 #46 拍频闪烁。
- **创意/变体**：偶尔某段"接触不良"闪两下更真实。

---

### K. 故障 · 数字信号类（95–97）

#### 95. RGB 撕裂故障（Glitch Tear）
- **效果**：横向撕裂位移 + RGB 分离抖动后归位成字。
- **数学表达**：第 y 行位移 `= step(rand(y,t)-θ)·D·(1-t)`；通道偏移 `∝(1-t)`。
- **创意/变体**：偶发"大撕裂帧"增强故障感。

#### 96. 数据流下落（Datamosh Cascade）
- **效果**：字符像数据流/瀑布从上方下落锁定（矩阵雨变体）。
- **数学表达**：第列下落位置 `y = lerp(-H, 0, easeOut(t - col·d))`，拖尾渐隐。
- **创意/变体**：尾迹用渐隐字符串。

#### 97. 信号方波闪现（Square-Wave Strobe）
- **效果**：以方波节律硬闪几次后常亮（开关式）。
- **数学表达**：`opacity = (sin(ωt) > 0 ? 1 : 0)`，闪烁次数随 `t` 衰减。
- **创意/变体**：故障/警报/霓虹启动。

---

### L. 高阶创意 · 分形 · 混沌类（98–100）

#### 98. 分形递归展开（Fractal Recursive Unfold）
- **效果**：字按"整体→部分→细节"分形层级递归显现（自相似）。
- **数学表达**：第 L 层在 `t ∈ [L/Lmax,(L+1)/Lmax]` 区间显形，子单元数 `∝ branch^L`。
- **创意/变体**：科技/数学主题；可配科赫/谢尔宾斯基蒙版。

#### 99. 混沌吸引子归位（Strange Attractor Settle）
- **效果**：字符沿洛伦兹/混沌轨迹游走，能量衰减后停到目标位。
- **数学表达**：洛伦兹 `dx=σ(y-x), dy=x(ρ-z)-y, dz=xy-βz`；轨迹幅度 `×(1-t)` 收敛。
- **创意/变体**：极具"有机不可预测"美感，每个字轨迹不同。

#### 100. 逻辑斯蒂分岔涌现（Logistic-Map Bifurcation）
- **效果**：参数从稳定区扫到混沌区，字符位置由"单点→分岔→混沌→再锁定"涌现。
- **数学表达**：`x_{n+1} = r·x_n(1-x_n)`，`r = lerp(2.8, 4, t)`，末段强制收敛到目标。
- **创意/变体**：把"秩序→混沌→新秩序"的叙事直接可视化，作为压轴片头。

---

## 三、组合与编排建议（Composition Tips）

真正出彩的动画往往是**多个方法叠加 + 错峰编排**，对应业界"Combining Effects"经验：

- **属性叠加**：透明度 / 位移 / 缩放 / 模糊 / 颜色 各走不同曲线，再相乘或相加（如 #3 + #11 + #31）。
- **时间编排（stagger）**：用 B/F 类的 `delay(i)` 把任意"单字效果"升级为"整句编排"。
- **进入 + 退出**：本文聚焦"出现"，退出常用其时间反演 `t → 1 - t` 或反向曲线。
- **节奏对齐**：把关键过冲点（如弹簧峰值、闪现 #7、爆点 #9）对齐到音乐节拍 / 重音。
- **可读性优先**：动效服务于信息——正文用克制的 #1/#3/#11，标题与品牌字才使用 #82/#95/#100 等强表现方法。

### 数学工具箱速查（便于复用）
| 类别 | 代表公式 | 适合表达 |
|------|----------|----------|
| 多项式 | `t^n`, `1-(1-t)^n` | 平滑加减速 |
| 指数/对数 | `1-2^(-10t)`, `ln(1+kt)` | 冲入 / 拖尾 |
| Sigmoid | `1/(1+e^(-k(t-.5)))` | 自然 S 曲线 |
| 高斯 | `e^(-(t-μ)²/2σ²)` | 闪现 / 聚焦权重 |
| 三角 | `sin, cos, tan` | 波动 / 摆动 / 脉动 |
| 阻尼振荡 | `A·e^(-ζt)·sin(ωt)` | 弹簧 / 回弹 |
| 极坐标 | `r(t), θ(t)` | 螺旋 / 环形 |
| 参数曲线 | 李萨如 / 摆线 / 贝塞尔 | 轨迹入场 |
| 噪声 | `noise`, `curl-noise` | 有机抖动 / 流场 |
| 随机/概率 | `rand(i)`, `Exp(λ)`, Bayer | 乱序 / 溶解 / 雨滴 |
| 分形/混沌 | 递归 / 洛伦兹 / 逻辑斯蒂 | 涌现 / 叙事化 |

---

## 四、各类别「全屏展示编排」设计（入场 / 出场 / 堆栈）

> 用于把每一类做成**全屏突出展示**动画（一段大字登场 → 让位给下一段 → 旧内容沉淀为历史）。
> 关键原则：**每个类别的入场 / 出场 / 堆栈都应体现该类自身的数学特色**，而不是统一套用同一套转场。
> 下表中的"主角"= 当前全屏大字；"历史"= 已让位、退居一侧或背景的旧内容。
> 通用时间记号：`d = (frame - i·SEG)/SEG`（连续出场序数，`d∈[0,1)` 为主角、`d≥1` 为历史）；`m = max(0, d-1)`（离场/堆叠推进量）。

### 编排总览速查
| 类 | 特色 | 入场动画 | 出场/转场动画 | 历史堆栈形态 |
|----|------|----------|---------------|---------------|
| A 透明度/指数 | 纯明暗曲线 | 按各自 opacity 曲线在中下方淡入 | 缩小+旋转滑向左侧 | 左侧竖排日志，按龄渐暗淡出 |
| B 缓动/方向位移 | 方向感+惯性 | 带 Back/Elastic 过冲的定向滑入 | 沿反方向加速甩出（带运动模糊） | 沿运动轴排成"轨道"（底部横向滑轨） |
| C 缩放/形变/3D | 体量+纵深 | 弹簧 Pop / 3D 翻牌从纵深推出 | 沿 Z 轴后退缩小入景深 | 透视景深卡牌（越旧越远越小） |
| D 模糊/滤镜 | 焦点切换 | Blur→Focus 对焦登场 | 失焦+缩小成"虚化缩略图" | 背景虚化小图，永远略带 blur |
| E 三角/波动 | 振荡+周期 | 波浪/弹跳沿正弦上浮 | 沿正弦路径摇摆离场 | 排在正弦曲线/轨道上轻微荡漾 |
| F 逐字/交错 | 逐字节奏 | 打字机/级联逐字出 | 字符各自飞散或字距坍缩 | 压缩成终端式日志行向上滚动 |
| G 裁剪/遮罩 | 擦除揭示 | Wipe/光圈揭开 | 遮罩反向闭合擦除 | 半揭的窄条缩略，藏在遮罩边后 |
| H 噪声/随机 | 不确定性 | 乱码解码/噪声抖动收敛 | 溶解成噪点/扬沙飞散 | 随机散落的抖动碎片，轻微跳变 |
| I 粒子/重组 | 聚散 | 粒子飞入聚合成字 | 炸成粒子飞向堆栈位再小型重组 | 碎屑场/小型粒子字漂浮环绕 |
| J 颜色/光影 | 色彩情绪 | 色相旋转/流光扫入 | 去色+变暗，高光扫走 | 灰阶小色板竖列（像色卡） |
| K 故障/数字 | 信号干扰 | 故障撕裂/数据流下落 | 故障崩塌成一行"日志" | CRT 扫描线迷你终端，闪烁抖动 |
| L 分形/混沌 | 涌现+轨迹 | 分形递归展开/吸引子归位 | 沿混沌轨迹螺旋飞离 | 沿螺旋/分形布局，各自微混沌轨道 |

---

### A · 透明度 — 多项式与指数曲线（已实现）
- **入场**：主角在画面中下方以超大字号出现，透明度严格走该方法自己的曲线（线性 / t² / 三次缓出 / 指数 / 对数 / Sigmoid / 高斯闪现 / 伽马 / 双指数过冲 / 幂律阶梯）。
- **出场**：`m` 推进时 `scale: 1→0.32`、`rotate: 0→-9°`、位置由中下方滑向左上方。
- **堆栈**：左侧竖排"历史日志"，新者在上、旧者下移，`opacity` 随龄按 `interpolate(m,[MAX-1,MAX],[1,0])` 淡出。
- **理由**：A 类的灵魂是"明暗变化曲线"，因此入场只用纯透明度差异，转场用最克制的缩放/位移，避免喧宾夺主。

### B · 缓动与方向位移 — 方向感与惯性
- **入场**：主角从屏外某方向（上/下/左/右，逐条轮换）**带过冲**滑入：`pos = lerp(offEdge, center, easeOutBack/Elastic(d))`，并叠加进入方向的运动模糊 `blur ∝ |v|`。
- **出场**：沿**与入场相反**的方向加速甩出：`x = center + easeInBack(m)·exitDist`，离场段拉伸 `scaleX>1` + 方向模糊，强调惯性。
- **堆栈**：旧内容不堆成竖列，而是排成**底部横向滑轨**（像跑马灯/胶片轨），随新内容到来整体左移一格，体现"位移"主题。
- **数学特色**：`easeOutBack` `easeOutElastic` `easeInBack`、速度 `v = d/dt(ease)` 驱动模糊。

### C · 缩放 · 形变 · 3D — 体量与纵深
- **入场**：弹簧 `spring()` Pop（`scale 0→1` 过冲），或绕 Y 轴 `rotateY:90°→0°` 翻牌从纵深 `translateZ:-800→0` 推出，配 `perspective`。
- **出场**：主角沿 **Z 轴后退**：`translateZ: 0→-1200`、`scale↓`、轻微 `rotateY`，像退入景深远处。
- **堆栈**：历史排成**透视卡牌堆**——越旧 `translateZ` 越负、越小越偏上，叠出一摞 3D 卡片的纵深感（而非平面竖列）。
- **数学特色**：弹簧阻尼、`perspective` 投影、`squash&stretch`（`scaleX·scaleY=const`）。

### D · 模糊 · 滤镜 — 焦点切换
- **入场**：`blur: 16px→0` 对焦登场，配 `scale 1.05→1` 模拟镜头对焦；可叠墨水晕染/辉光。
- **出场**：主角**失焦**：`blur: 0→14px` 同时 `scale→0.4`、亮度略降，缩成一张"虚化缩略图"。
- **堆栈**：历史作为**背景虚化层**——永远保持 `blur(6~10px)` 的小图，错落排在画面外圈，营造景深背景。
- **数学特色**：`filter: blur/brightness/contrast`、`e^(-kt)` 控制晕染收敛、色差通道偏移 `Δ∝(1-t)`。

### E · 三角函数 · 波动 — 振荡与周期
- **入场**：沿正弦上浮 `y = A·sin(2πf·u-ωd)·(1-d)`，或心跳脉动 `scale=1+A·(sinωd+½sin2ωd)·e^(-kd)`。
- **出场**：沿**正弦路径摇摆离场**：`x = center + A·sin(ω·m)`、`rotate = θ·sin(ω·m)`，振幅随 `m` 增大，像被波浪推走。
- **堆栈**：历史不静止，而是**挂在一条正弦曲线/圆轨上轻微荡漾**（持续 `y += A·sin(ωt+φ_i)`），呼应"波"的永动感。
- **数学特色**：`sin/cos`、阻尼振荡、李萨如/极坐标轨迹。

### F · 逐字符 · 交错编排 — 逐字节奏
- **入场**：以**字符为单位**入场——打字机（`n=floor(d·N)`）、左→右级联（`delay(i)=i·s`）、居中开花（`delay(i)=|i-N/2|·s`）、逐字波浪。
- **出场**：字符**各自离散**离场——或随机方向飞散（`rand(i)` 定向）、或字距坍缩 `letterSpacing→负` 收成一团、或逐字熄灭。
- **堆栈**：历史压缩成**终端式日志行**，逐行向上滚动（等宽字体、行高收紧），像命令行回滚，强化"逐字/逐行"主题。
- **数学特色**：`delay(i)`、`τ=clamp((t-i·s)/w,0,1)`、高斯权重交错、`rand(i)` 种子固定。

### G · 裁剪 · 遮罩揭示 — 擦除揭示
- **入场**：`clipPath` 揭开——横向 Wipe `inset(0 (100(1-p))% 0 0)`、对角 polygon、圆形光圈 `circle(p·150% at cx cy)`、笔画手写 `strokeDashoffset=L(1-p)`。
- **出场**：遮罩**反向闭合**把主角擦掉（Wipe-out / 光圈收缩），擦除边带一道高光。
- **堆栈**：历史以**被遮罩裁剩的窄条/缩略**形式藏在遮罩边缘后（像卡片露出一条边），点出"裁剪"语言。
- **数学特色**：`clip-path` 几何参数随 `p` 推进、`stroke-dashoffset`、SVG mask 缩放。

### H · 噪声 · 随机 · 概率 — 不确定性
- **入场**：乱码解码（锁定时间 `lock(i)=i·d`，未锁定显 `randomGlyph`）、噪声抖动收敛 `offset=noise(i,t·f)·A·(1-d)`、概率点亮 `rand(i)<d`。
- **出场**：主角**溶解成噪点/扬沙**——像素按 Bayer 阈值 `bayer(x,y)>m` 逐步消失，或粒子化随机飞散。
- **堆栈**：历史是**随机散落的抖动碎片**（位置带 `rand(i)` 抖动、持续微跳变），呈现"信息未完全稳定"的不确定氛围。
- **数学特色**：`rand(seed)`、Perlin `noise`、Bayer 抖动矩阵、泊松/布朗、softmax 坍缩。

### I · 粒子 · 分解重组 — 聚散
- **入场**：四散粒子飞入**聚合成字** `pos=lerp(spawn_k, glyph_k, easeOut(d))`，或破碎倒放拼回。
- **出场**：主角**炸成粒子**（冲击波/爆点），粒子飞向各自的堆栈目标位后**小型重组**成历史小字。
- **堆栈**：历史以**碎屑场/小型粒子字**漂浮环绕（轻微 curl-noise 流动），像残留的星尘。
- **数学特色**：粒子位置插值、`rand(i)` 散布、冲击波半径 `R(t)`、curl-noise 流场、指数增殖 `2^(floor(t·k))`。

### J · 颜色 · 光影 — 色彩情绪
- **入场**：色相旋转 `hue=lerp(360n, target, easeOut(d))` + 饱和度 `0→100%`，或流光 `bgPos:-100%→200%` 扫亮（`background-clip:text`）。
- **出场**：主角**去色+变暗**（`saturate→0`、`brightness↓`），一道高光从上面"扫走"它。
- **堆栈**：历史排成**灰阶小色板竖列**（像设计稿色卡），仅主角保留满色，强调"色彩"是该类核心变量。
- **数学特色**：`filter: hue-rotate/saturate/brightness`、渐变位置插值、黑体色温曲线 `T(t)`、`textShadow` 辉光衰减。

### K · 故障 · 数字信号 — 信号干扰
- **入场**：RGB 撕裂故障入场（行位移 `step(rand(y,t)-θ)·D·(1-d)` + 通道偏移 `∝(1-d)`），或数据流/矩阵雨下落锁定。
- **出场**：主角**故障崩塌**——剧烈撕裂几帧后坍塌成一行细窄的"日志条"。
- **堆栈**：历史是**CRT 扫描线迷你终端**条目（带扫描行、轻微 RGB 抖动、偶发闪烁），整体像一块旧显示器的滚动日志。
- **数学特色**：`step/方波`、`rand` 撕裂、通道偏移、扫描线相位、拍频闪烁 `cos(2πf₁t)cos(2πf₂t)`。

### L · 高阶创意 · 分形 · 混沌 — 涌现与轨迹
- **入场**：分形递归展开（第 L 层在 `d∈[L/Lmax,(L+1)/Lmax]` 显形），或混沌吸引子轨迹收敛归位（轨迹幅度 `×(1-d)`）。
- **出场**：主角**沿混沌/螺旋轨迹飞离**——按洛伦兹或对数螺旋 `r=a·e^(bθ)` 越绕越远并淡出。
- **堆栈**：历史**沿一条螺旋/分形布局排列**，每条还在自己的微混沌轨道上轻颤，整体像一张"涌现星图"。
- **数学特色**：递归层级、洛伦兹 `dx=σ(y-x)…`、逻辑斯蒂 `x_{n+1}=r·x_n(1-x_n)`、阿基米德/对数螺旋。

> 实现映射：以上 `d`、`m`、`delay(i)`、各 `filter`/`transform` 公式，均可直接落到 Remotion 的
> `useCurrentFrame` / `interpolate` / `spring` / `Easing` / `clip-path` / CSS `filter` 上。
> A 类已按本节"A"实现（见 `src/OpacityCurvesA.tsx`），B–L 将按各自编排逐类实现。

---

## 五、效果库 + 场景模板架构（解耦）

> 100 个效果在网格里同步循环（`SceneWall`）：
>
> ![wall](media/wall.webp)

> **背景**：第四节把"主角入场 + 历史堆栈"这一套编排**强行套到全部 100 法**上，导致 glitch / 粒子这类本该是炸裂标题的效果，被硬接了一个字幕式的历史栈——这就是"割裂感"的来源。
> **结论**：把**两个维度拆开**——「**动效原子**」只描述*单段文字怎么进 / 怎么出*；「**场景模板**」负责*布局 / 角色 / 停留 / 是否堆叠*。任意一个原子都能插进任意场景。

### 5.1 核心抽象

```ts
type Phase = 'in' | 'out';

// 动效原子：给定阶段 + 进度 t∈[0,1]，只返回作用在「一段文字」上的视觉。
// 不含任何布局 / 定位 / 堆栈 / 角色信息。
type TextEffect = {
  id; category; name; enName; formula;
  visual(args: {text; phase; t; frame; seed}): {
    wrapper?: CSSProperties;  // 整体 transform / filter / opacity / clip-path …
    content?: ReactNode;      // 逐字 / 粒子等自定义渲染（缺省即纯文字）
  };
};
```

统一的「在场度」抽象让同一段数学同时驱动进与出：

```
presence(phase, t) = phase==='in' ? ease(t) : 1 - ease(t)
```

- `presence: 0` → 不可见 / 极小；`1` → 完全在场。入场是 `0→1`，出场是 `1→0`。
- 场景只决定调用哪个原子、给什么字号 / 配色 / 位置 / 时机，**不关心效果内部数学**。

代码落点：
- `src/textfx/types.ts` — `Phase` / `TextEffect` 等类型
- `src/textfx/shared.tsx` — `presence` / `PerChar`（逐字）/ `Scramble`（解码）等共享构件
- `src/textfx/library.tsx` — 把全部 **100 法**实现为纯原子（A 复用原 `opacityCurves`，B–L 按各自数学重写为纯进 / 出）
- `src/textfx/TextFx.tsx` — 渲染器：把「场景给的 baseStyle」与「效果给的 wrapper / content」组合

### 5.2 场景模板（9 个）

| 场景 | 角色 | 布局 / 停留 | 堆叠 | 适配效果 | 合成 ID |
|------|------|------------|------|----------|---------|
| **Hero 主标题** | 单段超大、居中 | 戏剧化进 → 停留 → 戏剧化出 | 否 | 弹簧 / 3D / 螺旋 / 粒子 / glitch | `SceneHero` |
| **Caption 字幕** | 下三分之一、带底条 | 快速进出、原地替换、停留为主 | 否 | 淡入 / 上移 / 打字 / 模糊 | `SceneCaption` |
| **List 逐条列表** | 左对齐竖排 | 条目依次入场并**持续累积** | 累积 | 交错 / 级联 / 上移 | `SceneList` |
| **Lower-third 角标** | 左下、品牌竖条 | 滑入 → 停留 → 滑出 | 否 | 方向位移 / 遮罩擦除 | `SceneLowerThird` |
| **Emphasis 行内强调** | 句中某词高亮 | 周边先淡入、强调词登场 | 否 | 弹簧 / 辉光 / 解码 / 计数 | `SceneEmphasis` |
| **Gallery 目录陈列** | 主角 + 历史栈 | 顺序推上主角位 | 左上历史栈 | 任意（把库当内容陈列） | `SceneGallery` |
| **Reel 串联成片** | 多场景拼成完整成片 | 各片段顺序播放、时长求和 | — | 任意（每段独立选效果） | `SceneReel` |
| **Thumb 缩略图** | 单原子静态预览 | 定格在 t=0.62 | 否 | 任意（生成选效果缩略图） | `SceneThumb` |
| **Wall 动态预览墙** | 全部效果网格同步循环 | 10×10 网格、统一 in→hold→out | 否 | 全库（人类一眼选效果） | `SceneWall` |

各场景预览（动图）：

| Hero | Caption | List |
|------|---------|------|
| ![hero](media/hero.webp) | ![caption](media/caption.webp) | ![list](media/list.webp) |
| **LowerThird** | **Emphasis** | **Gallery** |
| ![lowerthird](media/lowerthird.webp) | ![emphasis](media/emphasis.webp) | ![gallery](media/gallery.webp) |

Reel 串联成片（片头 → 列表 → 角标 → 字幕 → 强调 → 结尾）：

![reel](media/reel.webp)

要点：
- **Hero / Caption / Lower-third / Emphasis** 用统一的顺序编排 `seqAt(frame, {inF, holdF, outF})`：每条占一个 *入场 + 停留 + 出场* 的时槽，同一时刻只有一条在台上，**不堆叠**。
- **List** 用 `i·stepFrames` 错峰触发，每条入场后**保持不消失**，体现"逐条建立"。
- **Gallery** 是一个**特定但合法**的场景：把"效果库"本身当成内容来逐个陈列（沿用第四节的主角 + 历史栈思想），适合 demo reel / 浏览整库——而非单条生产用法。它现在直接消费 `library.tsx`，可一次过完整 100 法。

> 同一个原子（如 `72 乱码解码`）可同时出现在 Hero（炸裂标题）、Caption（柔和字幕）、Emphasis（高亮关键词）三个场景里——这正是解耦后的核心收益。

代码落点：`src/textfx/scenes/*.tsx`（各场景）+ `src/textfx/scenes/sequence.ts`（顺序时序）+ `src/textfx/presets.ts`（默认 props / 合成入口）。

### 5.3 面向其他 AI 的调用约定

为便于其他 AI / 程序"零改代码出片"，所有场景已 **props 化**（Zod schema + `calculateMetadata` 自动算时长）：

```bash
npx remotion render src/index.ts SceneHero out.mp4 --props='{"entries":[{"text":"标题","effectId":21}], ...}'
```

- 统一出口：`src/textfx/index.ts`（`EFFECTS` / 场景 / `TextFx` / schema / 清单 一处导入）
- 机读清单：`docs/effects.json`（100 法 + 9 场景，每条效果含 `thumbnail`，`npm run gen:manifest` 重新生成）
- 人类快速选效果：`docs/preview.html`（可点击预览页）/ `docs/thumbnails-contact-sheet.png`（缩略图总览）/ `SceneWall`（动态预览墙）
- 详细用法与各场景 props 示例：见 **`docs/ai-usage.md`**

---

*文档用途：Remotion 文字动画的设计灵感与数学参考。后续实现时，将上述 `t`、`p`、`d`、`m`、`delay(i)` 等映射到 `useCurrentFrame` / `interpolate` / `spring` / `Easing` 即可。*

---

<h2 id="english-overview">English overview</h2>

<p align="right"><a href="#100-种字体出现方式参考数学表达--创意">↑ 简体中文（full document）</a></p>

This document is a **design + math reference** for "text/font entrance animations" in **Remotion**. It contains design notes and formulas only — no runnable Remotion code. The body above is written in Chinese; this section summarizes it in English. (The 100 effects' English names are already listed inline above as the second line of each entry, and in machine-readable form in [`effects.json`](./effects.json).)

### Notation

| Symbol | Meaning |
|---|---|
| `frame` / `fps` | current frame (`useCurrentFrame()`) / frame rate |
| `t` | normalized progress `t = clamp((frame - delay) / dur, 0, 1)`, `t ∈ [0,1]` |
| `p` | eased progress `p = ease(t)` |
| `i` / `N` | index / total count of animation units (char / word / line) |
| `u` | unit normalized position `u = i / max(N-1, 1)` |
| `τ` | unit-local progress after stagger offset |
| `rand(i)` | deterministic per-seed pseudo-random `∈ [0,1)` (stable per frame) |
| `noise(x)` | 1D smooth / Perlin noise `∈ [-1,1]` |
| `lerp(a,b,p)` | linear interpolation, maps to Remotion's `interpolate` |

### The 12 categories (A–L)

| Cat | Theme | Math means |
|---|---|---|
| A | Opacity · polynomial & exponential curves | polynomials, exp/log, Sigmoid, Gaussian, power-step |
| B | Easing & directional motion | easings, back/elastic overshoot, projectile, damped spring |
| C | Scale · transform · 3D | spring pop, squash/stretch, perspective, card flip, extrude |
| D | Blur · filters | blur-to-focus, chromatic aberration, halftone, pixelate, heat-haze |
| E | Trigonometric · wave | traveling/standing sine, Lissajous, polar spiral, cycloid |
| F | Per-character stagger | typewriter, linear/center-out/Gaussian stagger, domino, blinds |
| G | Clip · mask | wipe, diagonal, iris, mosaic, scanline, handwriting, liquid fill |
| H | Noise · randomness | scramble/decode, dither, Brownian, Poisson, curl-noise, SNR rise |
| I | Particles · reassembly | assemble, reverse-shatter, shockwave, voxel stack, mitosis |
| J | Color · light | hue-rotate, gradient sweep, blackbody, long-shadow, neon |
| K | Glitch · datamosh | RGB tear, datamosh cascade, square-wave strobe |
| L | Fractal · chaos | fractal unfold, Lorenz attractor settle, logistic bifurcation |

### Effect library + scene templates

The 100 effects are pure **entrance/exit atoms** (`effectId ∈ [1,100]`): each only describes *how a single piece of text enters/exits*. **Scene templates** own layout / role / dwell / stacking. Any atom plugs into any scene.

- 9 scenes: Hero, Caption, List, LowerThird, Emphasis, Gallery, Reel, Thumb, Wall.
- All scenes are **props-driven** (Zod schema + `calculateMetadata` auto duration), so other AIs/programs render with zero code changes.
- For rendering commands, per-scene props examples, and the configurable typography/position params (`fontSize/fontWeight/fontFamily/letterSpacing/align/vAlign/offsetX/offsetY/...`), see **[`ai-usage.en.md`](./ai-usage.en.md)**.
- For a project overview see **[`../README.en.md`](../README.en.md)**.

> When implementing, map `t`, `p`, `d`, `m`, `delay(i)` to `useCurrentFrame` / `interpolate` / `spring` / `Easing`.
