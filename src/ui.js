function createLabel(text, fontSize, bold, frame, opacity) {
  var label = NSTextField.alloc().initWithFrame(frame)
  label.setStringValue(text)
  label.setFont((bold) ? NSFont.boldSystemFontOfSize(fontSize) : NSFont.systemFontOfSize(fontSize))
  label.setBezeled(false)
  label.setDrawsBackground(false)
  label.setEditable(false)
  label.setSelectable(false)
  if (opacity) label.setAlphaValue(opacity)

  return label
}

function createTextField(value, placeholder, frame) {
  var textfield = NSTextField.alloc().initWithFrame(frame)
  textfield.cell().setWraps(false);
  textfield.cell().setScrollable(true);
  textfield.setStringValue(value);
  if (placeholder) textfield.setPlaceholderString(placeholder);

  return textfield
}

function createDropdown(values, frame){
  var dropdown = NSPopUpButton.alloc().initWithFrame(frame)
  dropdown.addItemsWithTitles(values)

  return dropdown
}

export const MODES = {
  Triangles: 1,
  Rectangles: 2,
  Ellipses: 3,
  Circles: 4,
  'Rotated Rectangles': 5,
  'Quadratic Beziers': 6,
  'Rotated Ellipses': 7,
  Quadrilaterals: 8,
  Combo: 0
}

export default function createWindow() {
  var alert = COSAlertWindow.new()
  alert.addButtonWithTitle("OK")
  alert.addButtonWithTitle("Cancel")
  alert.setMessageText("Sketch Primitives")
  alert.setInformativeText("Primitives tries to find the most optimal shape that can be drawn to maximize the similarity between the target image and the drawn image. It repeats this process, adding one shape at a time. It is quite CPU intensive, so don't panic if you see a beach ball :)")
  alert.setIcon(NSImage.alloc().initByReferencingFile(require('./icon.png').replace('file://', '')));

  const typeLabel = createLabel("Shape Type", 12, true, NSMakeRect(0, 0, 300, 16))
  const type = createDropdown(Object.keys(MODES), NSMakeRect(0, 0, 300, 24))

  const optionsView = NSView.alloc().initWithFrame(NSMakeRect(0, 0, 300, 80));
  const optionsLabel = createLabel("Options", 12, true, NSMakeRect(0, 54, 300, 16));
  const numberLabel = createLabel("Shapes number", 12, false, NSMakeRect(0, 30, 300, 16));
  const number = createTextField("100", null, NSMakeRect(0, 0, 90, 24));
  const alphaLabel = createLabel("Alpha", 12, false, NSMakeRect(110, 30, 300, 16));
  const alphaRangeLabel = createLabel("(0 let the algorithm pick)", 12, false, NSMakeRect(146, 30, 300, 16), 0.3);
  const alpha = createTextField("128", null, NSMakeRect(110, 0, 190, 24));


  alert.addAccessoryView(typeLabel);
  alert.addAccessoryView(type);
  optionsView.addSubview(optionsLabel);
  optionsView.addSubview(alphaLabel);
  optionsView.addSubview(alphaRangeLabel);
  optionsView.addSubview(alpha);
  optionsView.addSubview(numberLabel);
  optionsView.addSubview(number);
  alert.addAccessoryView(optionsView);

  alert.alert().window().setInitialFirstResponder(type);
  type.setNextKeyView(number);
  number.setNextKeyView(alpha);

  var response = alert.runModal();

  var inputs = {
    type: type.titleOfSelectedItem(),
    alpha: parseInt(alpha.stringValue()),
    number: parseInt(alpha.stringValue())
  };

  return {
    ok: response == '1000', inputs
  }
}
