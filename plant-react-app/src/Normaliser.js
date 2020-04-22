 class Normaliser {
    range = [];
    domain = [];

    mapToRange = (min, max) => {
        this.range = [min, max];
        return this;
    }

    withDomain = (min, max) => {
        this.domain = [min, max]
        return this;
    }

    normalise = (value) => {
        const min = 0;
        const max = 1;
        const range = this.range[max] - this.range[min];
        const domainRange = this.domain[max] - this.domain[min];

        console.log(range);
        console.log(domainRange);
        
        return this.range[min] + ((value - this.domain[min]) * range / domainRange)
    }
 }

export default Normaliser