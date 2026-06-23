import {Composition} from 'remotion';
import {TextMotion} from './TextMotion';
import {OpacityCurvesA} from './OpacityCurvesA';
import {EasingMotionB} from './showcases/EasingMotionB';
import {ScaleTransform3DC} from './showcases/ScaleTransform3DC';
import {BlurFilterD} from './showcases/BlurFilterD';
import {WaveTrigE} from './showcases/WaveTrigE';
import {PerCharStaggerF} from './showcases/PerCharStaggerF';
import {ClipMaskG} from './showcases/ClipMaskG';
import {NoiseRandomH} from './showcases/NoiseRandomH';
import {ParticleI} from './showcases/ParticleI';
import {ColorLightJ} from './showcases/ColorLightJ';
import {GlitchK} from './showcases/GlitchK';
import {FractalChaosL} from './showcases/FractalChaosL';
import {HeroScene} from './textfx/scenes/HeroScene';
import {CaptionScene} from './textfx/scenes/CaptionScene';
import {ListScene} from './textfx/scenes/ListScene';
import {LowerThirdScene} from './textfx/scenes/LowerThirdScene';
import {EmphasisScene} from './textfx/scenes/EmphasisScene';
import {GalleryScene} from './textfx/scenes/GalleryScene';
import {ReelScene} from './textfx/scenes/ReelScene';
import {ThemeScene} from './textfx/scenes/ThemeScene';
import {ThumbScene} from './textfx/scenes/ThumbScene';
import {WallScene} from './textfx/scenes/WallScene';
import {
  heroSchema,
  captionSchema,
  listSchema,
  lowerThirdSchema,
  emphasisSchema,
  gallerySchema,
  reelSchema,
  thumbSchema,
  wallSchema,
  heroFrames,
  captionFrames,
  listFrames,
  lowerThirdFrames,
  emphasisFrames,
  galleryFrames,
  reelFrames,
  wallFrames,
} from './textfx/schemas';
import {themeConfigSchema, themeConfigFrames, THEME_CONFIG_DEFAULT} from './textfx/themes';
import {
  HERO_DEFAULT,
  CAPTION_DEFAULT,
  LIST_DEFAULT,
  LOWER_THIRD_DEFAULT,
  EMPHASIS_DEFAULT,
  GALLERY_DEFAULT,
  REEL_DEFAULT,
  THUMB_DEFAULT,
  WALL_DEFAULT,
} from './textfx/presets';
import {totalFrames} from './effects/showcaseKit';
import {
  CATEGORY_B,
  CATEGORY_C,
  CATEGORY_D,
  CATEGORY_E,
  CATEGORY_F,
  CATEGORY_G,
  CATEGORY_H,
  CATEGORY_I,
  CATEGORY_J,
  CATEGORY_K,
  CATEGORY_L,
} from './effects/categories';

const COMMON = {fps: 30, width: 1920, height: 1080} as const;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="TextMotion"
        component={TextMotion}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          text: 'Hello Motion Graphics',
        }}
      />
      <Composition id="OpacityCurvesA" component={OpacityCurvesA} durationInFrames={624} {...COMMON} />
      <Composition
        id="EasingMotionB"
        component={EasingMotionB}
        durationInFrames={totalFrames(CATEGORY_B.length)}
        {...COMMON}
      />
      <Composition
        id="ScaleTransform3DC"
        component={ScaleTransform3DC}
        durationInFrames={totalFrames(CATEGORY_C.length)}
        {...COMMON}
      />
      <Composition
        id="BlurFilterD"
        component={BlurFilterD}
        durationInFrames={totalFrames(CATEGORY_D.length)}
        {...COMMON}
      />
      <Composition
        id="WaveTrigE"
        component={WaveTrigE}
        durationInFrames={totalFrames(CATEGORY_E.length)}
        {...COMMON}
      />
      <Composition
        id="PerCharStaggerF"
        component={PerCharStaggerF}
        durationInFrames={totalFrames(CATEGORY_F.length)}
        {...COMMON}
      />
      <Composition
        id="ClipMaskG"
        component={ClipMaskG}
        durationInFrames={totalFrames(CATEGORY_G.length)}
        {...COMMON}
      />
      <Composition
        id="NoiseRandomH"
        component={NoiseRandomH}
        durationInFrames={totalFrames(CATEGORY_H.length)}
        {...COMMON}
      />
      <Composition
        id="ParticleI"
        component={ParticleI}
        durationInFrames={totalFrames(CATEGORY_I.length)}
        {...COMMON}
      />
      <Composition
        id="ColorLightJ"
        component={ColorLightJ}
        durationInFrames={totalFrames(CATEGORY_J.length)}
        {...COMMON}
      />
      <Composition
        id="GlitchK"
        component={GlitchK}
        durationInFrames={totalFrames(CATEGORY_K.length)}
        {...COMMON}
      />
      <Composition
        id="FractalChaosL"
        component={FractalChaosL}
        durationInFrames={totalFrames(CATEGORY_L.length)}
        {...COMMON}
      />
      <Composition
        id="SceneHero"
        component={HeroScene}
        schema={heroSchema}
        defaultProps={HERO_DEFAULT}
        durationInFrames={heroFrames(HERO_DEFAULT)}
        calculateMetadata={({props}) => ({durationInFrames: heroFrames(props)})}
        {...COMMON}
      />
      <Composition
        id="SceneCaption"
        component={CaptionScene}
        schema={captionSchema}
        defaultProps={CAPTION_DEFAULT}
        durationInFrames={captionFrames(CAPTION_DEFAULT)}
        calculateMetadata={({props}) => ({durationInFrames: captionFrames(props)})}
        {...COMMON}
      />
      <Composition
        id="SceneList"
        component={ListScene}
        schema={listSchema}
        defaultProps={LIST_DEFAULT}
        durationInFrames={listFrames(LIST_DEFAULT)}
        calculateMetadata={({props}) => ({durationInFrames: listFrames(props)})}
        {...COMMON}
      />
      <Composition
        id="SceneLowerThird"
        component={LowerThirdScene}
        schema={lowerThirdSchema}
        defaultProps={LOWER_THIRD_DEFAULT}
        durationInFrames={lowerThirdFrames(LOWER_THIRD_DEFAULT)}
        calculateMetadata={({props}) => ({durationInFrames: lowerThirdFrames(props)})}
        {...COMMON}
      />
      <Composition
        id="SceneEmphasis"
        component={EmphasisScene}
        schema={emphasisSchema}
        defaultProps={EMPHASIS_DEFAULT}
        durationInFrames={emphasisFrames(EMPHASIS_DEFAULT)}
        calculateMetadata={({props}) => ({durationInFrames: emphasisFrames(props)})}
        {...COMMON}
      />
      <Composition
        id="SceneGallery"
        component={GalleryScene}
        schema={gallerySchema}
        defaultProps={GALLERY_DEFAULT}
        durationInFrames={galleryFrames(GALLERY_DEFAULT)}
        calculateMetadata={({props}) => ({durationInFrames: galleryFrames(props)})}
        {...COMMON}
      />
      <Composition
        id="SceneReel"
        component={ReelScene}
        schema={reelSchema}
        defaultProps={REEL_DEFAULT}
        durationInFrames={reelFrames(REEL_DEFAULT)}
        calculateMetadata={({props}) => ({durationInFrames: reelFrames(props)})}
        {...COMMON}
      />
      <Composition
        id="SceneTheme"
        component={ThemeScene}
        schema={themeConfigSchema}
        defaultProps={THEME_CONFIG_DEFAULT}
        durationInFrames={themeConfigFrames(THEME_CONFIG_DEFAULT)}
        calculateMetadata={({props}) => ({durationInFrames: themeConfigFrames(props)})}
        {...COMMON}
      />
      <Composition
        id="SceneThumb"
        component={ThumbScene}
        schema={thumbSchema}
        defaultProps={THUMB_DEFAULT}
        durationInFrames={1}
        {...COMMON}
      />
      <Composition
        id="SceneWall"
        component={WallScene}
        schema={wallSchema}
        defaultProps={WALL_DEFAULT}
        durationInFrames={wallFrames(WALL_DEFAULT)}
        calculateMetadata={({props}) => ({durationInFrames: wallFrames(props)})}
        {...COMMON}
      />
    </>
  );
};
