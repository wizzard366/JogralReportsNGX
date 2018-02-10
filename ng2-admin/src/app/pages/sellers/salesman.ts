export class SalesMan{

    name: string;
    current: number;
    currentLocale:string;
    proyection: number;
    proyectionLocale:string;
    year: number;
    id:number;
    percentageOfProyection:any;

    sales_history:any;
    proyections:any;


    setName(name){
        this.name=name;
    }
    setCurrent(current){
        if (typeof current == 'undefined'){
            this.current=0;
            return 0;
        }
        this.current=current;
        this.currentLocale=current.toLocaleString('en-US');
    }
    setProyection(proyection){
        
        if (typeof proyection == 'undefined'){
            this.proyection=0;
            return 0;
        }
        this.proyection=proyection;
        this.proyectionLocale=proyection.toLocaleString('en-US');
    }
    setYear(year){
        this.year=year;
    }
    setId(id){
        this.id=id;
    }
    setSales_history(data){
        this.sales_history=data;
    }
    setProyections(data){
        this.proyections=data;
    }
    setPercentageOfProyection(){
        if(this.proyection===0){
            return 0;
        }
        this.percentageOfProyection = ((this.current*100)/this.proyection).toFixed(2);
    }
    getCurrent(){
        return this.current.toLocaleString();
    }
    getId(){
        return this.id;
    }
}