import Nouislider from "nouislider-react";
import React, { useReducer, useCallback, useMemo } from "react";
import "nouislider-react/node_modules/nouislider/distribute/nouislider.min.css"

import "./easilon.css"
import wNumb from 'wnumb'

const initialState:{ minHomeValue:number, maxHomeValue: number,homeValue:number,homeValueStart:number} = {
    minHomeValue:  500000,
    maxHomeValue: 1500000,
    homeValue: 1000000,
    homeValueStart: 1000000,
}

type Action = 
    | { type: 'SET_HOME_VALUE_SLIDE'; payload:number }
    | { type: 'SET_HOME_VALUE_SLIDE_END'; payload:number }
    | { type: 'SET_HOME_VALUE_INPUT_CHANGE'; payload:number }
    | { type: 'SET_HOME_VALUE_INPUT_END'; payload:number }

type State = {
    homeValue: number;
    homeValueStart: number;
    minHomeValue: number;
    maxHomeValue: number
}

const caculatorReducer = (state: State, action: Action):State => {
     let homeValue, minHomeValue, maxHomeValue;
     
    switch (action.type){
        case 'SET_HOME_VALUE_SLIDE':
            return {
                ...state,
                homeValue: action.payload,
            };

        case 'SET_HOME_VALUE_SLIDE_END':
            return {
                ...state,
                homeValueStart: action.payload,
            };
            
        case 'SET_HOME_VALUE_INPUT_CHANGE':
            homeValue = !action.payload ? 0 : action.payload;
            return {
                ...state,
                homeValue: homeValue
            };

        case 'SET_HOME_VALUE_INPUT_END':
            homeValue = action.payload;
            homeValue = homeValue < 100000 ? 100000 : homeValue > 4000000 ? 4000000 : homeValue;            
            // homeValue = Math.max(100000, Math.min(4000000,homeValue ))           
            minHomeValue = homeValue > 600000 ? homeValue - 500000 : 100000;
            maxHomeValue = homeValue + 500000;

            return{
                ...state,
                homeValue: homeValue,
                homeValueStart: homeValue,
                minHomeValue: minHomeValue,
                maxHomeValue: maxHomeValue
            };

        default:
            return state;
    }
}

export const HomeValueCaculator = ()=>{
    
    const [state, dispatch] = useReducer(caculatorReducer, initialState);
    
    const formatter = useMemo(()=> wNumb({
        decimals: 0,
        thousand: ','
    }), []);

    const handleHomeValueSlide = useCallback((values: string[]) =>{
        dispatch({type: 'SET_HOME_VALUE_SLIDE', payload: parseInt(values[0],10)});
    }, [] );
    const handleHomeValueSlideEnd = useCallback((values: string[]) =>{
        dispatch({type: 'SET_HOME_VALUE_SLIDE_END', payload: parseInt(values[0],10)});
    }, [] );
   
    const handleHomeValueInputChange = useCallback((e:any) =>{
        const homeValue =  formatter.from(e.target.value);
        dispatch({type: 'SET_HOME_VALUE_INPUT_CHANGE', payload: homeValue});
    }, [formatter] );
    const handleHomeValueInputEnd = useCallback((e:any) =>{
        const homeValue =  formatter.from(e.target.value);
        dispatch({type: 'SET_HOME_VALUE_INPUT_END', payload: homeValue});
    }, [formatter] );
    const renderHomeValue = ()=>{
        return(
            <>  
                <h6 className="fs-6 fw-medium mb-2">What is your home value?</h6>
                <small className="text-slate-400">如果输入的数值小于100000,显示100000；如果输入的数值大于4000000，就显示4000000</small>
                <div className="homeValue-val fs-5 fw-bold text-info" style={{paddingTop: '1rem'}}>
                $<input type="text" className="homeValue-val fs-5 fw-bold text-info no-border"
                  value={formatter.to(state.homeValue)}  onChange={handleHomeValueInputChange}  onBlur={handleHomeValueInputEnd}
                  spellCheck="false" data-ms-editor="true" />
                </div>
                <div className="input-box">
                    <Nouislider animate={true}  behaviour="snap"  start={state.homeValueStart} step={1000}
                        range={{
                            min: state.minHomeValue,
                            max: state.maxHomeValue
                        }} connect={[true, false]}
                        onSlide={handleHomeValueSlide}
                        onEnd={handleHomeValueSlideEnd}
                    />
                </div> 
                <div className="input-box__top">
                    <span>${formatter.to(state.minHomeValue)}</span>
                    <span>${formatter.to(state.maxHomeValue)}</span>
                </div>
            </>
        )
    }   

    return(
        <section className="loan-two loan-two--home section-space">
            <div className="container">
                <div className="loan-two__inner">
                <div className="loan-two__form mw-100 p-0">
                    <form
                    action="index-apply"
                    id="loan-calculator-01"
                    data-form-direction="ltr"
                    data-interest-rate="15"
                    className="loan-calculator-form wow fadeInUp p-0"
                    data-wow-duration="1500ms"
                    >
                    <span className="loan-form__bg"></span>
                    <h3 className="loan-calculator-form__title sec-title__title">How Much You May Qualify For</h3>
                    <div className="d-flex justify-content-between loan-calculator-form__content w-100">
                        <div className="flex-half">
                        { renderHomeValue() }
                        {/* { renderMortgageBalance() } */}
                        </div>
                        <div className="flex-fill loan-calculator-form_right">
                        {/* {
                            state.showAvailableAmount
                            ?
                            renderAvailableAmount()
                            :
                            renderNoEnoughEquity()
                        } */}
                        </div>
                    </div>
                    </form>
                </div>
            </div>
        </div>
    </section>
    )
}