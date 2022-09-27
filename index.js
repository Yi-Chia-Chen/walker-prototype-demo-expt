// Yi-Chia Chen


// ######## ##     ## ########  ########
// ##        ##   ##  ##     ##    ##
// ##         ## ##   ##     ##    ##
// ######      ###    ########     ##
// ##         ## ##   ##           ##
// ##        ##   ##  ##           ##
// ######## ##     ## ##           ##

const FORMAL = false;
const EXPERIMENT_NAME = 'aesBM';
const SUBJ_NUM_FILE = 'subjNum_' + EXPERIMENT_NAME + '.txt';
const TRIAL_FILE = 'trial_' + EXPERIMENT_NAME + '.txt';
const SUBJ_FILE = 'subj_' + EXPERIMENT_NAME + '.txt';
const VISIT_FILE = 'visit_' + EXPERIMENT_NAME + '.txt';
const ATTRITION_FILE = 'attrition_' + EXPERIMENT_NAME + '.txt';
const SAVING_SCRIPT = 'save.php';
const SAVING_DIR = FORMAL ? 'data/formal':'data/testing';

const BLOCK_N = 2;

const VIEWPORT_MIN_W = 800;
const VIEWPORT_MIN_H = 600;

const INSTR_READING_TIME_MIN = 0.5;
const INSTR_Q_ANSWER = ['aesthetics'];

// trial variables
const STIM_PATH = 'Stimuli/';
const WALKER_LIST = [
    'dav', 'emm'
];

const EMOTION_LIST = ['nu', 'ha', 'an', 'sa'];
const FACTOR_LIST = [WALKER_LIST, EMOTION_LIST];
const CONDITION_LIST = FACTORIAL_COND(FACTOR_LIST);
const STIM_TYPE_LIST = CONDITION_LIST.map(condition => condition.join('_'));
const FLIP_CONDITIONS = ['ori', 'mir'];

const EMOTION_CONDITION_N = EMOTION_LIST.length;
const WALKER_N = WALKER_LIST.length;

const PRACTICE_LIST = ['ale_af_ori.mp4'];
const PRACTICE_TRIAL_N = PRACTICE_LIST.length;
const BLOCK_TRIAL_N = EMOTION_CONDITION_N * WALKER_N;
const INSTR_TRIAL_N = PRACTICE_TRIAL_N + BLOCK_TRIAL_N;

const FLIP_INDICES = SHUFFLE_ARRAY(new Array(BLOCK_TRIAL_N/2).fill(0).concat(new Array(BLOCK_TRIAL_N/2).fill(1)));
const FLIP_CONDITION_LIST = FLIP_INDICES.map(i => FLIP_CONDITIONS[i]);
const STIM_LIST = STIM_TYPE_LIST.map((s, i) => s+'_'+FLIP_CONDITION_LIST[i]+'.mp4');
const TRIAL_LIST_LIST = [SHUFFLE_ARRAY(Array.from(STIM_LIST)), SHUFFLE_ARRAY(Array.from(STIM_LIST))];

// duration variables (in seconds)
const INTERTRIAL_INTERVAL = 0.5;

// object variables
var instr, subj, trial;


// ########  ########    ###    ########  ##    ##
// ##     ## ##         ## ##   ##     ##  ##  ##
// ##     ## ##        ##   ##  ##     ##   ####
// ########  ######   ##     ## ##     ##    ##
// ##   ##   ##       ######### ##     ##    ##
// ##    ##  ##       ##     ## ##     ##    ##
// ##     ## ######## ##     ## ########     ##

$(document).ready(function() {
    subj = new subjObject(subj_options);
    subj.id = 'demo';
    subj.saveVisit();
    if (subj.phone) {
        $('#instrText').html('It seems that you are using a touchscreen device or a phone. Please use a laptop or desktop instead.<br /><br />If you believe you have received this message in error, please contact the experimenter at yichiachen@ucla.edu<br /><br />Otherwise, please switch to a laptop or a desktop computer for this experiment.');
        $('#nextButton').hide();
        $('#instrBox').show();
    } else if (subj.id !== null){
        instr = new instrObject(instr_options);
        instr.start();
        instr.currentQ = 'aesthetics';
        trial_options['subj'] = subj;
        trial = new trialObject(trial_options);
    }
});

//  ######  ##     ## ########        ## ########  ######  ########
// ##    ## ##     ## ##     ##       ## ##       ##    ##    ##
// ##       ##     ## ##     ##       ## ##       ##          ##
//  ######  ##     ## ########        ## ######   ##          ##
//       ## ##     ## ##     ## ##    ## ##       ##          ##
// ##    ## ##     ## ##     ## ##    ## ##       ##    ##    ##
//  ######   #######  ########   ######  ########  ######     ##

const SUBJ_TITLES = [
    'num',
    'date',
    'startTime',
    'id',
    'userAgent',
    'endTime',
    'duration',
    'instrQAesAttemptN',
    'instrQEmoAttemptN',
    'instrReadingTimes',
    'quickReadingPageN',
    'hiddenCount',
    'hiddenDurations',
    'dailyThing',
    'dailyMovement',
    'typicalityThing',
    'typicalityMovement',
    'serious',
    'problems',
    'gender',
    'age',
    'inView',
    'viewportW',
    'viewportH'];

function INVALID_ID_FUNC() {
    $('#instrText').html("We can't identify a valid code from subject pool website. Please reopen the study from the subject pool website again. Thank you!");
    $('#nextButton').hide();
    $('#captchaBox').hide();
    $('#instrBox').show();
}

function HANDLE_VISIBILITY_CHANGE() {
    if (document.hidden) {
        subj.hiddenCount += 1;
        subj.hiddenStartTime = Date.now();
    } else  {
        subj.hiddenDurations.push((Date.now() - subj.hiddenStartTime)/1000);
    }
}

function SUBMIT_DEBRIEFING_Q() {
    subj.dailyThing = $('input[name=dailyThing]:checked').val();
    subj.dailyMovement = $('input[name=dailyMovement]:checked').val();
    subj.typicalityThing = $('input[name=typicalityThing]:checked').val();
    subj.typicalityMovement = $('input[name=typicalityMovement]:checked').val();
    subj.serious = $('input[name=serious]:checked').val();
    subj.problems = $('#problems').val();
    subj.gender = $('input[name=gender]:checked').val();
    subj.age = $('#age').val();
    var open_ended_list = [subj.problems, subj.age];
    var all_responded = CHECK_IF_RESPONDED(open_ended_list, [subj.dailyThing, subj.dailyMovement, subj.typicalityThing, subj.typicalityMovement, subj.serious, subj.gender]);
    if (all_responded) {
        $('#questionsBox').hide();
        $('#debriefingBox').show();
        $('html')[0].scrollIntoView();
    } else {
        $('#Qwarning').text('Please answer all questions to complete the experiment. Thank you!');
    }
}

var subj_options = {
    subjNumFile: SUBJ_NUM_FILE,
    titles: SUBJ_TITLES,
    invalidIDFunc: INVALID_ID_FUNC,
    viewportMinW: VIEWPORT_MIN_W,
    viewportMinH: VIEWPORT_MIN_H,
    savingScript: SAVING_SCRIPT,
    visitFile: VISIT_FILE,
    attritionFile: ATTRITION_FILE,
    subjFile: SUBJ_FILE,
    savingDir: SAVING_DIR,
    handleVisibilityChange: HANDLE_VISIBILITY_CHANGE
};


// #### ##    ##  ######  ######## ########
//  ##  ###   ## ##    ##    ##    ##     ##
//  ##  ####  ## ##          ##    ##     ##
//  ##  ## ## ##  ######     ##    ########
//  ##  ##  ####       ##    ##    ##   ##
//  ##  ##   ### ##    ##    ##    ##    ##
// #### ##    ##  ######     ##    ##     ##

var instr_text = new Array;
instr_text[0] = 'Do you sometimes notice how different people walk in different ways? This study is about that!<br /><br />We are a bunch of scientists studying human actions and aesthetics, and we want to know what people think is a good-looking way to walk.';
instr_text[1] = "Your contributions may help in designing robots and making animations in movies or video games!<br /><br />And, most importantly, we hope this is fun for you, too!";
instr_text[2] = 'Please help us by reading the instructions in the next few pages carefully, and avoid using the refresh or back buttons.';
instr_text[3] = 'Now, please maximize your browser window.';
instr_text[4] = 'Please also turn off any music you are playing. Music is known to have effects on our kind of studies and it will make our data unusable.';
instr_text[5] = 'This study has two parts, and will takes about 5 minutes in total to complete.';
instr_text[6] = "Here's your job for the first part: you will be shown " + INSTR_TRIAL_N + ' movies of people walking, one at a time. The walkers in the movies are illustrated only with a few light dots, as in the example below.';
instr_text[7] = 'We are interested in <span class="emphasis">how <strong>visually pleasing</strong> you find each walking style to be</span>.<br /><br />In other words, how good/beautiful do you think the walking style looks?';
instr_text[8] = 'Six options will be available below the movie as six buttons (as in below). Just click one of the options based on your preference.';
instr_text[9] = "Sometimes, it might feel awkward to explicitly rate walking styles.<br /><br />Don't worry about it too much: we're really just interested in your initial gut reaction.";
instr_text[10] = 'To give you a sense of what you will be seeing, see 4 example movies below.<br /><br />Based on these examples, please try to use the full range of the 6 options in your ratings.';
instr_text[11] = "The next page is a quick instruction quiz. (It's very simple!)";
instr_text[12] = ''; // instruction question 1
instr_text[13] = "Great! You can press SPACE to start. Please focus after you start. (Don't switch to other windows or tabs!)";
instr_text[14] = "You're done with the first part! Thank you!";
instr_text[15] = "In the second part, you'll be shown similar movies, again. This time, we are interested 'in your impression of the walker's emotions.<br /><br />Some walkers in the movies may appear to be in a positive mood, some others may appear to be less positive.";
instr_text[16] = "You will select from the six options illustrated below to indicate <span class='emphasis'>how <strong>positive</strong> you find each walker's emotion to be</span>.<br /><br />In other words, how positive of a mood do you think the walker is in?";
instr_text[17] = "The next page is a quick instruction quiz. (It's very simple!)";
instr_text[18] = ''; // instruction question 2
instr_text[19] = "Great! You can press SPACE to start. Please focus after you start. (Don't switch to other windows or tabs!)";


const INSTR_FUNC_DICT = {
    0: SHOW_STICKMAN,
    1: HIDE_INSTR_IMG,
    3: SHOW_MAXIMIZE_WINDOW,
    4: SHOW_NO_MUSIC,
    5: HIDE_INSTR_IMG,
    6: SHOW_INSTR_WALKER,
    7: HIDE_INSTR_WALKER,
    8: SHOW_RATING_BUTTONS,
    9: HIDE_RATING_BUTTONS,
    10: SHOW_EXAMPLE_WALKERS,
    11: HIDE_EXAMPLE_WALKERS,
    12: SHOW_INSTR_QUESTION,
    13: SHOW_CONSENT,
    16: SHOW_RATING_BUTTONS,
    17: HIDE_RATING_BUTTONS,
    18: SHOW_INSTR_QUESTION,
    19: READY_SECOND_BLOCK
};

const REPEAT_INSTR_INDEX_DICT = {
    'aesthetics':-1,
    'emotion':14
}

function SHOW_INSTR_IMG(file_name) {
    $('#instrImg').attr('src', STIM_PATH + file_name);
    $('#instrImg').css('display', 'block');
}

function HIDE_INSTR_IMG() {
    $('#instrImg').css('display', 'none');
}

function SHOW_STICKMAN() {
    SHOW_INSTR_IMG('stickman_walking.png');
}

function SHOW_MAXIMIZE_WINDOW() {
    SHOW_INSTR_IMG('maximize_window.png');
}

function SHOW_NO_MUSIC() {
    SHOW_INSTR_IMG('no_music.png');
}

function SHOW_INSTR_WALKER() {
    $('#instrVid').css('display', 'block');
    $('#instrVid')[0].play();
}

function HIDE_INSTR_WALKER() {
    $('#instrVid')[0].pause();
    $('#instrVid').hide();
}

function SHOW_RATING_BUTTONS() {
    $('#ratingExample').show();
}

function HIDE_RATING_BUTTONS() {
    $('#ratingExample').hide();
}

function SHOW_EXAMPLE_WALKERS() {
    $('.exampleVidContainer').show();
    $( '.instrExamples' ).each(function() {
        $(this).get(0).play();
    });
}

function HIDE_EXAMPLE_WALKERS() {
    $( '.instrExamples' ).each(function() {
        $(this).get(0).pause();
    });
    $('.exampleVidContainer').hide();
}

function SHOW_INSTR_QUESTION() {
    $('#instrBox').hide();
    $('#instrQBox').show();
}

function SUBMIT_INSTR_Q() {
    var instrChoice = $('input[name="instrQ"]:checked').val();
    if (typeof instrChoice == 'undefined') {
        $('#instrQWarning').text('Please answer the question. Thank you!');
    } else if (instrChoice != instr.currentQ) {
        instr.qAttemptN[instr.currentQ] += 1;
        $('#instrText').html('You have given an incorrect answer. Please read the instructions again carefully.');
        $('#instrBox').show();
        $('#instrQBox').hide();
        $('input[name="instrQ"]:checked').prop('checked', false);
        instr.index = REPEAT_INSTR_INDEX_DICT[instr.currentQ];
    } else {
        instr.next();
        $('#instrQBox').hide();
        $('#instrBox').show();
    }
}

function SHOW_CONSENT() {
    $('#nextButton').hide();
    $('#consentBox').show();
    $('#instrBox').attr('id', 'instrBoxScroll');
    $('#instrBoxScroll').show();
    $(document).keyup(function(e) {
        if (e.which == 32) {
            $(document).off('keyup');
            $('#instrBoxScroll').attr('id', 'instrBox');
            $('#instrBox').hide();
            $('#consentBox').hide();
            $('#nextButton').show();
            SHOW_BLOCK();
        }
    });
}

function SECOND_BLOCK_INSTR() {
    instr.next();
    $('#instrBox').show();
    instr.currentQ = 'emotion';
    $('.adj').text('Positive');
    $('.ratingButton').show();
    $('input[name="instrQ"]:checked').prop('checked', false);
}

function READY_SECOND_BLOCK() {
    $('#nextButton').hide();
    $(document).keyup(function(e) {
        if (e.which == 32) {
            $(document).off('keyup');
            $('#instrBox').hide();
            SHOW_BLOCK();
        }
    });
}

var instr_options = {
    text: instr_text,
    funcDict: INSTR_FUNC_DICT,
    qConditions: ['aesthetics','emotion']
};


// ######## ########  ####    ###    ##
//    ##    ##     ##  ##    ## ##   ##
//    ##    ##     ##  ##   ##   ##  ##
//    ##    ########   ##  ##     ## ##
//    ##    ##   ##    ##  ######### ##
//    ##    ##    ##   ##  ##     ## ##
//    ##    ##     ## #### ##     ## ########

const TRIAL_TITLES = [
    'num',
    'date',
    'subjStartTime',
    'blockNum',
    'trialNum',
    'stimName',
    'inView',
    'response',
    'rt'];

function SHOW_BLOCK() {
    trial.blockNum = trial.blockNum + 1;
    trial.trialNum = -trial.pracTrialN;
    trial.pracList = Array.from(PRACTICE_LIST);
    trial.trialList = TRIAL_LIST_LIST[trial.blockNum-1];
    $('.ratingButton').hide();
    $('#trialBox').show();
    subj.detectVisibilityStart();
    trial.run();
}

function TRIAL_UPDATE(formal_trial, last, this_trial, next_trial, path) {
    trial.stimName = this_trial;
    $('#progress').text(Math.round(trial.progress));
    $('#testVid source').attr('src', path + this_trial);
    $('#testVid')[0].load();
    $('#testVid').on('ended', RESPONSE_START);
    if (!last) {
        BUFFER_VIDEO($('#bufferVid')[0], path+next_trial);
    }
}

function RESPONSE_START() {
    $('#testVid').off('ended');
    $('.ratingButton').show();
    $('#testVid').hide();
    trial.startTime = Date.now();
    $('.ratingButton').mouseup(function(event) {
        $('.ratingButton').unbind('mouseup');
        $('.ratingButton').hide();
        var target = $(event.target).closest('.ratingButton');
        trial.end(target.attr('id'));
    });
}

function TRIAL() {
    $('#testVid').show();
    $('#testVid')[0].play();
    trial.inView = CHECK_FULLY_IN_VIEW($('#testVid'));
}

function END_BLOCK() {
    $('#trialBox').hide();
    subj.detectVisibilityEnd();
    if (trial.blockNum == BLOCK_N) {
        $('#questionsBox').show();
    }
    else {
        SECOND_BLOCK_INSTR();
    }
}

function END_TO_SONA() {
    const COMPLETION_URL = 'https://ycc.vision/';
    window.location.href = COMPLETION_URL;
}

var trial_options = {
    subj: 'pre-define',
    pracTrialN: PRACTICE_TRIAL_N,
    trialN: BLOCK_TRIAL_N,
    titles: TRIAL_TITLES,
    stimPath: STIM_PATH,
    dataFile: TRIAL_FILE,
    savingScript: SAVING_SCRIPT,
    savingDir: SAVING_DIR,
    trialList: false,
    pracList: false,
    intertrialInterval: INTERTRIAL_INTERVAL,
    updateFunc: TRIAL_UPDATE,
    trialFunc: TRIAL,
    endExptFunc: END_BLOCK,
    progressInfo: true
}