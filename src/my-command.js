import exec from './exec'

const PATH_TO_PRIMITIVE = context.plugin.urlForResourceNamed('primitive').path().replace(/ /g, '\\ ')
const TEMP_JPG_FILE = `${String(NSTemporaryDirectory()())}/primitive-temp.jpg`
const TEMP_SVG_FILE = `${String(NSTemporaryDirectory()())}/primitive-temp.svg`

function getSVGLayerFromFile (path) {
  const svgImporter = MSSVGImporter.svgImporter();
  const svgURL = NSURL.fileURLWithPath(path);
  svgImporter.prepareToImportFromURL(svgURL);
  const svgLayer = svgImporter.importAsLayer();
  return svgLayer
}

function toArray(object) {
  if (Array.isArray(object)) {
    return object
  }
  const arr = []
  for (let j = 0; j < object.count(); j += 1) {
    arr.push(object.objectAtIndex(j))
  }
  return arr
}

export default function(context) {
  if (context.selection) {
    const bitmapLayers = toArray(context.selection).filter(layer => layer.className() == 'MSBitmapLayer')

    if (bitmapLayers.length) {
      bitmapLayers.forEach(layer => {
        const image = layer.image().image()
        let imageData = layer.image().image().TIFFRepresentation()
        const imageRep = NSBitmapImageRep.imageRepWithData(imageData)
        const imageProps = {
          [NSImageCompressionFactor]: NSNumber.numberWithFloat(1.0)
        };
        imageData = imageRep.representationUsingType_properties(NSJPEGFileType, imageProps)
        imageData.writeToFile_atomically(TEMP_JPG_FILE, false)

        try {
          exec(`${PATH_TO_PRIMITIVE} -i "${TEMP_JPG_FILE}" -o "${TEMP_SVG_FILE}" -n 100`)

          const svgLayer = getSVGLayerFromFile(TEMP_SVG_FILE)
          svgLayer.setName(layer.name() + ' Primitive');
          context.document.currentPage().addLayers([svgLayer]);

          exec(`rm -f "${TEMP_JPG_FILE}"`)
          exec(`rm -f "${TEMP_SVG_FILE}"`)
        } catch (err) {
          log(err)
        }
      })
      return
    }
  }

  context.document.showMessage('No image selected')
}
