export default class Animation {
    constructor(from, to, duration) {
        this.duration = duration;
        this.from = from;
        this.to = to;
    }

    easeInOutQuad(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
      }
    
    start() {
        var self = this;
        const startTime = performance.now();
        var requestId = requestAnimationFrame(function fn() {

            const currentTime = performance.now();
  
            // 计算已经过去的时间
            const timeElapsed = currentTime - startTime;
            
            // 计算当前滚动位置
            var current = [];
            for(var i=0;i<self.from.length;i++) {
                current.push(self.easeInOutQuad(timeElapsed, self.from[i], self.to[i] - self.from[i], self.duration));
            }

            if(self.onchange) self.onchange(current);
            
            // 如果未达到目标位置，继续动画
            if (timeElapsed < self.duration) {
                requestAnimationFrame(fn);
            } else {
                cancelAnimationFrame(requestId)
                if(self.oncomplete) self.oncomplete();
            }
        });
    }
    
    onchange(callback) {
        this.onchange = callback;
    }
    
    oncomplete(callback) {
        this.oncomplete = callback;
    }
}