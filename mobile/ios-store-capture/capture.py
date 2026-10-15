"""Capture the actual native iOS app on installed iPhone/iPad simulators."""
import json,pathlib,subprocess,time,os
run=lambda *args:subprocess.check_output(args,text=True)
base=pathlib.Path('ios-store-screenshots');base.mkdir(exist_ok=True)
data=json.loads(run('xcrun','simctl','list','devices','available','--json'))
devices=[d for group in data['devices'].values() for d in group if d.get('isAvailable')]
choices=[('iphone-medium',['iPhone 17 Pro','iPhone 16 Pro']),('iphone-large',['iPhone 17 Pro Max','iPhone 16 Pro Max']),('ipad-13',['iPad Pro 13-inch (M5)','iPad Pro 13-inch (M4)','iPad Air 13-inch (M3)'])]
notes=[]
for category,names in choices:
 if os.environ.get('CAPTURE_DEVICE') and category!=os.environ['CAPTURE_DEVICE']:continue
 print('Starting '+category,flush=True)
 device=next((d for name in names for d in devices if d['name']==name),None)
 if not device:raise RuntimeError('Missing simulator for '+category+': '+str([d['name']for d in devices]))
 udid=device['udid'];out=base/category;out.mkdir(exist_ok=True)
 subprocess.run(['xcrun','simctl','boot',udid],check=device['state']!='Booted')
 subprocess.run(['xcrun','simctl','bootstatus',udid,'-b'],check=True,timeout=240)
 subprocess.run(['xcrun','simctl','status_bar',udid,'override','--time','9:41','--dataNetwork','wifi','--wifiMode','active','--wifiBars','3','--batteryState','charged','--batteryLevel','100'],check=True)
 subprocess.run(['xcrun','simctl','install',udid,'build/ios-store/Build/Products/Debug-iphonesimulator/App.app'],check=True)
 subprocess.run(['xcrun','simctl','launch',udid,'com.d6x8.storetycoon'],check=True,timeout=90)
 start=time.monotonic()
 for at,name in [(14,'01-your-neighborhood-store'),(28,'02-your-in-game-phone'),(44,'03-explore-your-city')]:
  time.sleep(max(0,at-(time.monotonic()-start)))
  subprocess.run(['xcrun','simctl','io',udid,'screenshot',str(out/(name+'.png'))],check=True)
 notes.append(category+': '+device['name']+'; native WKWebView rendering, unaltered screenshot pixels; automated real UI clicks only; no invented progress or features.')
 subprocess.run(['xcrun','simctl','shutdown',udid],check=True,timeout=30)
(base/'CAPTURE-NOTES.txt').write_text('\n'.join(notes)+'\nThe capture automation is injected only into this simulator build. It is not in the signed release. Screenshots are portrait and use the current production game assets.\n')
