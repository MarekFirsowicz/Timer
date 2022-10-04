
class MechanicalTimer {
    constructor (divName){
        this.rotation = {hr:0, mn:0, sc:0}
        this.appContainer=document.querySelector(`#${divName}`)
        this.switcher = 0
        this.startTimer = false
        this.intId;
        this.alarmId;
        this.time=0;
        this.middleBbtn;
        this.rightBtn;
        this.leftBtn;
        this.flashClick = new Audio('./assets/flashClick.mp3')
        this.click = new Audio('./assets/click.mp3')
        this.alarm = new Audio('./assets/alarm2.mp3')
    }

    createRing(idName, arr){
        const loopNo = Array.isArray(arr)?arr.length: arr
        const container = document.createElement('div')
        container.setAttribute('class', 'ring')
        container.setAttribute('id', idName)
        this.appContainer.appendChild(container)

        for(let i=0; i< loopNo; i++){
            const innerDiv = document.createElement('div')
            innerDiv.innerHTML+=Array.isArray(arr)?arr[i]:i%5===0?i:'|'
            innerDiv.style.transform=`rotate(${i*(360/loopNo)}deg)`
            container.appendChild(innerDiv)
        }
    }

    setTime(inc, elem, id, e){        
        this.rotation[elem] += (e.deltaY * inc)       
        if(-this.rotation[elem]>=360){
            this.rotation[elem]=-360
        }else if(-this.rotation[elem]<=0){
            this.rotation[elem]=0
        } 
        const el = document.querySelector(`#${id}`)
        this.setTimeRing(id, elem)       
        this.time = (this.rotation.hr/30)*3600+(this.rotation.mn/6)*60+(this.rotation.sc/6)
    }

    setTimeRing(ringId, elem){
        const el = document.querySelector(`#${ringId}`)      
        el.style.transform = `rotate(${this.rotation[elem]}deg)`  
        this.click.play()  
    }

    setTimerBtn (id){
        const setter = document.createElement('div')
        setter.setAttribute('id', `${id}`)
        setter.setAttribute('class', 'setter')
        const verticalRod = document.createElement('div')
        verticalRod.setAttribute('class', 'verticalRod')        
        this.appContainer.appendChild(setter)
        setter.appendChild(verticalRod)
    }

    setMiddleSwitch(id){
        this.middleBtn = document.querySelector(`#${id}>.verticalRod`)
        this.middleBtn.onclick = ()=>this.setCountdown()
        const html = '<div>s</div><div>m</div><div>h</div>'
        this.middleBtn.innerHTML = html        
    }

    setRightSwitch(id){
        this.rightBtn = document.querySelector(`#${id}>.verticalRod`)
        this.rightBtn.onclick=()=>this.setStartTimer()
    }

    setLeftSwitch(id){
        this.leftBtn = document.querySelector(`#${id}>.verticalRod`)
        this.leftBtn.onclick=()=>this.setResetTimer()
    }

    setCountdown (){ 
        if(!this.startTimer)this.switcher ++
        if(this.switcher>3||this.switcher<0){
            this.flashClick.play()
            this.appContainer.removeEventListener('wheel', this.appContainer.sc, false)
            this.appContainer.removeEventListener('wheel', this.appContainer.mn, false)
            this.appContainer.removeEventListener('wheel', this.appContainer.hr, false)
            this.switcher=0  
            this.middleBtn.style.height='calc(var(--size)/12.5)'   
        }        
        if(this.switcher===1){
            this.flashClick.play()
            this.appContainer.addEventListener('wheel', this.appContainer.hr=(e)=>{
                this.setTime(0.3,'hr','hourRing',e)                
            })
            this.middleBtn.style.height= 'calc((var(--size)/12.5)*0.75)'
        }
        if(this.switcher===2){ 
            this.flashClick.play()          
            this.appContainer.removeEventListener('wheel', this.appContainer.hr, false)
            this.appContainer.addEventListener('wheel',this.appContainer.mn=(e)=>{
                this.setTime(0.06,'mn','minutesRing',e)
            })
            this.middleBtn.style.height= 'calc((var(--size)/12.5)*0.5)'
           }
        if(this.switcher===3){
            this.flashClick.play()
            this.appContainer.removeEventListener('wheel', this.appContainer.mn, false)
            this.appContainer.addEventListener('wheel', this.appContainer.sc=(e)=>{
                this.setTime(0.06,'sc','secondsRing',e)
            })
            this.middleBtn.style.height= 'calc((var(--size)/12.5)*0.25)'
            }
    }

    setStartTimer(){
        if(this.switcher===0&&this.time){
            this.flashClick.play()
            this.startTimer=!this.startTimer}
        if(this.startTimer&&this.time&&this.switcher===0){
            this.intId =setInterval(()=>this.increment(),1000)
            this.rightBtn.style.height='calc((var(--size)/12.5)*0.5)'
        }else if(!this.startTimer){
            clearInterval(this.intId)
            this.rightBtn.style.height='calc((var(--size)/12.5)*0.75)'
        }              
    }

    reset(){
        this.rotation={hr:0, mn:0, sc:0}
        this.time=null
        this.switcher=-5
        this.startTimer=false
        clearInterval(this.intId)
        clearInterval(this.alarmId)
        this.setCountdown()
        this.rightBtn.style.height='calc((var(--size)/12.5)*0.75)'
        this.middleBtn.style.height='calc(var(--size)/12.5)'
        this.setTimeRing('hourRing', 'hr')
        this.setTimeRing('minutesRing', 'mn')
        this.setTimeRing('secondsRing', 'sc')  
        this.leftBtn.classList.remove('reset')
    }

    setResetTimer (){
        this.flashClick.play() 
        this.reset()                     
    }

    increment(){
        this.time++
        this.rotation.sc= (this.time%60)*6
        this.rotation.mn= Math.ceil(((this.time)-(this.rotation.hr*120))/60)*6
        this.rotation.hr = Math.ceil(this.time/3600)*30
/*
        const hours = Math.ceil(this.time/3600)*30
        const minutes = Math.ceil(((this.time)-(this.rotation.hr*120))/60)*6
        const seconds = (this.time%60)*6
        const seconds2 = Math.ceil((this.time-(this.rotation.mn*10)-(this.rotation.hr*120)))*6
*/
        this.setTimeRing('secondsRing', 'sc') 
        this.setTimeRing('hourRing', 'hr')
        this.setTimeRing('minutesRing', 'mn')
        if(this.time>=0){
            clearInterval(this.intId)
            this.alarmId=setInterval(()=>this.alarm.play(),1)
        }        
    }    
    
    showTimerFace(){
        const quarters = Array(4).fill('<i class="fas fa-caret-down"></i>')
        const romanHours = ['XII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI']
        this.setTimerBtn('middleBtn')
        this.setTimerBtn('rightBtn')
        this.setTimerBtn('leftBtn')        
        this.setMiddleSwitch('middleBtn') 
        this.setRightSwitch('rightBtn')
        this.setLeftSwitch('leftBtn')
        this.createRing('outerRing', quarters)
        this.createRing('hourRing', romanHours)
        this.createRing('minutesRing', 60)
        this.createRing('secondsRing', 60)     
    }
}

let timer = new MechanicalTimer('mechanicalWatch')
timer.showTimerFace()
