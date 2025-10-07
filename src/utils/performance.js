export const performanceMetrics = {
  startTime: null,
  metrics: {},

  start() {
    this.startTime = performance.now()
    this.metrics = {}
  },

  mark(name) {
    if (!this.metrics[name]) {
      this.metrics[name] = {
        start: performance.now(),
        end: null,
        duration: null
      }
    } else {
      this.metrics[name].end = performance.now()
      this.metrics[name].duration = this.metrics[name].end - this.metrics[name].start
    }
  },

  getMetrics() {
    const totalTime = performance.now() - this.startTime
    return {
      totalTime,
      metrics: this.metrics,
      summary: Object.entries(this.metrics).reduce((acc, [name, metric]) => {
        if (metric.duration) {
          acc[name] = {
            duration: metric.duration,
            percentage: (metric.duration / totalTime) * 100
          }
        }
        return acc
      }, {})
    }
  },

  logMetrics() {
    if (process.env.NODE_ENV === 'development') {
      const metrics = this.getMetrics()
      console.group('Performance Metrics')
      console.log('Total Time:', metrics.totalTime.toFixed(2), 'ms')
      console.table(metrics.summary)
      console.groupEnd()
    }
  }
}

// Performance monitoring for API calls
export const apiPerformance = {
  metrics: {},

  start(name) {
    this.metrics[name] = {
      start: performance.now(),
      end: null,
      duration: null
    }
  },

  end(name) {
    if (this.metrics[name]) {
      this.metrics[name].end = performance.now()
      this.metrics[name].duration = this.metrics[name].end - this.metrics[name].start
    }
  },

  getMetrics() {
    return this.metrics
  },

  logMetrics() {
    if (process.env.NODE_ENV === 'development') {
      console.group('API Performance Metrics')
      console.table(this.metrics)
      console.groupEnd()
    }
  }
}
