export default function exec (command) {
  var task = NSTask.alloc().init()
  var pipe = NSPipe.pipe()
  var errPipe = NSPipe.pipe()

  task.setLaunchPath_('/bin/bash')
  task.setArguments_(NSArray.arrayWithArray_(['-c', '-l', command]))
  task.standardOutput = pipe
  task.standardError = errPipe
  task.launch()

  const errData = errPipe.fileHandleForReading().readDataToEndOfFile()
  const data = pipe.fileHandleForReading().readDataToEndOfFile()

  if (task.terminationStatus() != 0) {
    let message = 'Unknow error'
    if (errData != null && errData.length()) {
      message = NSString.alloc().initWithData_encoding_(errData, NSUTF8StringEncoding)
    } else if (data != null && data.length()) {
      message = NSString.alloc().initWithData_encoding_(data, NSUTF8StringEncoding)
    }
    return NSException.raise_format_('failed', message)
  }

  return NSString.alloc().initWithData_encoding_(data, NSUTF8StringEncoding)
}
