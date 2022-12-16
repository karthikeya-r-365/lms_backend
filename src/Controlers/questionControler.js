const questionModel = require('../Models/questionModel');
//const ansModel = require('../Models/optionModel');
const ansModel = require('../Models/answerModel');


const createQuestions = async (req, res)=>{
    try{
        let data = req.body;

        let {level_id, question_title, question_disc, question_points, options}= data;
        
        let nData = await questionModel.create(data)

        res.status(201).send({data: nData});


    } catch(err){
        console.log(err)
        res.status(501).send({Error: err})
    }
}

const createQuestinsWithAnswer = async (req, res) =>{
    try{
        let data = req.body;

        let {level_id, question_title, question_desc, question_img, question_points, options, answer} = data;
        
        //console.log(data)

        let qData = await questionModel.create({
            level_id: data.level_id,
            question_title: data.question_title,
            question_desc: data.question_desc,
            question_img: data.question_img,
            question_points: data.question_points,
            options: data.options
        });

        //console.log(qData);

        let aData = await ansModel.create({
            question_id: qData._id,
            answer: data.answer
        });

        //console.log(aData)

        res.status(201).send({qnData: qData, ansData: aData})


    } catch(err){
        console.log(err)
        res.status(501).send({Error: err})
    }
}

const getQuestions = async (req, res)=>{
    try{

    let allData = await questionModel.find()

    res.status(200).send({data: allData})
    } catch(err){
        console.log(err)
        res.status(501).send({Error: err})
    }
}


const getQuestionWithId = async (req, res)=>{
    try{
        //let lmt_nbr = req.query.lmt_nbr
        let qID =  req.params.questionId
        //console.log(levelId)
        let allData = await questionModel.find({_id:qID})
        console.log(allData)

        res.status(200).send({data: allData});


    } catch(err){
        console.log(err)
        res.status(501).send({Error: err})
    }
}

const getQuestions_by_levelID = async (req, res)=>{
    try{
        let lvl_ID = req.params.levelId
        let allData = await questionModel.find({level_id:lvl_ID})

        res.status(200).send({data: allData})
    } catch(err){
        console.log(err)
        res.status(501).send({error: err})
    }
}

const getQuestion_by_levelId_limit = async (req, res)=>{
    try{
        let lvl_ID = req.params.levelId
        //let lmt_nbr = req.query.limitNbr
        //console.log(lmt_nbr)
        let allData = await questionModel.find({level_id:lvl_ID}).limit(req.query.limit)

        res.status(200).send({data: allData})
    } catch(err){
        console.log(err)
        res.status(501).send({error: err})
    }
}

const insertMany = async (req, res)=>{
    try{

        let data = req.body;

        let {level_id, question_title, question_desc, question_img, question_points, options, answer} = data;

        console.log(data.data.length)

        let qnData = [];
        let anData =[];

        for(let i=0; i<data.data.length;i++){
            if(data.data[i]){
                qnData.push({
                    level_id: data.data[i].level_id,
                    question_title: data.data[i].question_title, 
                    question_desc: data.data[i].question_desc, 
                    question_img: data.data[i].question_img, 
                    question_points: data.data[i].question_points, 
                    options: data.data[i].options,
                })
           
            }
            if(data.data[i]){
                anData.push({
                    answer: data.data[i].answer
                })
            }
        }
        //console.log(qnData, anData )
let inQN = await questionModel.insertMany(qnData) ;

       // console.log([...inQN])
        let qId = [];

        

        for(let j=0; j<inQN.length; j++){
            if(inQN[j]){
                anData[j]['question_id'] = inQN[j]._id
            }
        }
console.log(anData)
let fAns = await ansModel.insertMany(anData)
        res.send({qn_data:inQN, ans_data:fAns  })


    } catch(err){
        console.log(err)
        res.send({error: err})
    }
}

module.exports = {createQuestions, createQuestinsWithAnswer, getQuestions, getQuestionWithId, getQuestions_by_levelID, getQuestion_by_levelId_limit, insertMany }