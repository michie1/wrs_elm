--port module App.Update exposing (update, updateWithStorage, calcRaceId)


port module App.Update exposing (update, calcRaceId)

import App.Model exposing (App)
import App.Routing
import App.Msg exposing (Msg(..))
import App.Commands
import App.UrlUpdate
import Races.Model exposing (Race)
import Riders.Model
import Comments.Model
import Account.Model
import Results.Model
import Riders.Update
import Results.Update
import Comments.Update
import Account.Update
import Navigation
import String
import Debug
import Array
import Set
import Json.Decode


-- exposing ((:=))
--import Json.Encode

import App.Decoder
import Date
import Time
import Date.Extra
import Task
import Keyboard.Extra
import Dom

type alias StoredApp =
    { page : String
    , riders : List Riders.Model.Rider
    , races : List Races.Model.Race
    , comments : List Comments.Model.Comment
    , results : List Results.Model.Result
    }


port saveState : String -> Cmd msg



--port setStorage : StoredApp -> Cmd msg
--port setAutocomplete : String -> Cmd msg


port resetState : String -> Cmd msg


port updateMaterialize : () -> Cmd msg


port autocomplete : ( String, List String ) -> Cmd msg



{--
updateWithStorage : Msg -> App -> ( App, Cmd Msg )
updateWithStorage msg app =
    let
        ( newApp, cmds ) =
            update msg app
    in
        ( newApp
        , Cmd.batch
            [ setStorage (StoredApp (toString newApp.page) newApp.riders newApp.races newApp.comments newApp.results)
            , cmds
            ]
        )
--}


update : Msg -> App -> ( App, Cmd Msg )
update msg app =
    case msg of
        RaceAdd ->
            case app.raceAdd of
                Just raceAdd ->
                    case raceAdd.name /= "" of
                        True -> 
                            let
                                dateString = Maybe.withDefault "" raceAdd.dateString

                                newRace =
                                    Races.Model.Race
                                        (calcRaceId app.races)
                                        raceAdd.name
                                        dateString -- raceAdd.dateString
                                        raceAdd.category

                                --Races.Model.Classic
                            in
                                ( { app
                                    | races =
                                        (newRace :: app.races)
                                        --, raceAdd = Nothing
                                  }
                                , Navigation.newUrl ("#races/" ++ (toString newRace.id))
                                )
                        False ->
                            ( app, Cmd.none )

                Nothing ->
                    ( app, Cmd.none )

        SetRaceName newName ->
            case app.raceAdd of
                Just raceAdd ->
                    let
                        newRaceAdd =
                            { raceAdd | name = newName }
                    in
                        ( { app
                            | raceAdd = Just newRaceAdd
                          }
                        , Cmd.none
                        )

                Nothing ->
                    ( app, Cmd.none )

        RaceAddCategory category ->
            case app.raceAdd of
                Just raceAdd ->
                    let
                        nextRaceAdd =
                            { raceAdd | category = category }
                    in
                        ( { app | raceAdd = Just nextRaceAdd }
                        , Cmd.none
                        )

                Nothing ->
                    ( app, Cmd.none )

        SetRaceDate newDate ->
            case app.raceAdd of
                Just raceAdd ->
                    let
                        newRaceAdd =
                            { raceAdd | dateString = Just newDate }
                    in
                        ( { app
                            | raceAdd = Just newRaceAdd
                          }
                        , Cmd.none
                        )

                Nothing ->
                    ( app, Cmd.none )

        AddRider rider ->
            Riders.Update.addRider app rider

        SetRiderName newName ->
            Riders.Update.setRiderAddName app newName

        ResultAdd ->
            let
                ( maybeResult, cmd ) =
                    Results.Update.addResult app
            in
                case maybeResult of
                    Just result ->
                        ( { app | results = result :: app.results }
                        , cmd
                        )

                    Nothing ->
                        ( app, cmd )

        ResultAddCategory category ->
            case app.resultAdd of
                Just resultAdd ->
                    let
                        nextResultAdd =
                            { resultAdd | category = category }
                    in
                        ( { app | resultAdd = Just nextResultAdd }
                        , Cmd.none
                        )

                Nothing ->
                    ( app, Cmd.none )

        ResultAddStrava link ->
            case app.resultAdd of
                Just resultAdd ->
                    let
                        nextResultAdd =
                            { resultAdd | strava = link }
                    in
                        ( { app | resultAdd = Just nextResultAdd }
                        , Cmd.none
                        )

                Nothing ->
                    ( app, Cmd.none )

        SetResultAddResult value ->
            case app.resultAdd of
                Just resultAdd ->
                    let
                        resultAddWithResult =
                            { resultAdd | result = value }
                    in
                        ( { app | resultAdd = Just resultAddWithResult }
                        , Cmd.none
                        )

                Nothing ->
                    ( app, Cmd.none )

        SetResultRiderName name ->
            let
                a =
                    Debug.log "name" name
            in
                Results.Update.setRider app name

        CommentAddSetText text ->
            case app.commentAdd of
                Just commentAdd ->
                    let
                        --account =
                        --riderId = account.id
                        commentAddWithText =
                            { commentAdd
                                | text =
                                    text
                                    --, riderId = riderId
                            }
                    in
                        ( { app | commentAdd = Just commentAddWithText }
                        , Cmd.none
                        )

                Nothing ->
                    ( app, Cmd.none )

        --Comments.Update.setText app text
        CommentAddSetRiderName riderName ->
            case app.commentAdd of
                Just commentAdd ->
                    let
                        commentAddWithRiderName =
                            { commentAdd | riderName = riderName }
                    in
                        ( { app | commentAdd = Just commentAddWithRiderName }
                        , Cmd.none
                        )

                Nothing ->
                    ( app, Cmd.none )

        CommentAdd ->
            let
                nowTask =
                    Task.perform
                        (Just >> App.Msg.CommentAdd2)
                        Time.now
            in
                ( app, Cmd.batch [ nowTask ] )

        CommentAdd2 maybeTime ->
            case maybeTime of
                Just time ->
                    let
                        datetime =
                            (formatTime (Date.fromTime time)) ++ " " ++ (formatDate (Date.fromTime time))

                        ( comment, cmd ) =
                            Comments.Update.new
                                ((List.length app.comments) + 1)
                                datetime
                                app
                    in
                        ( { app
                            | comments = (Debug.log "comment2" comment) :: app.comments
                            , commentAdd = Nothing
                          }
                        , cmd
                        )

                Nothing ->
                    ( app, Cmd.none )

        {--
        GoTo page ->
            ( app
            , (Navigation.newUrl (App.Page.toHash page))
            )
    --}
        Save ->
            ( app
            , saveState (Debug.log "alert message" "message")
              --, Cmd.none
            )

        Log message ->
            let
                m =
                    Debug.log "message" message
            in
                ( app
                , Cmd.none
                )

        Reset ->
            ( App.Model.initial, Cmd.none )

        --( app
        --, (resetState "reset")
        --)
        UpdateMaterialize ->
            let
                bla =
                    Debug.log "update Materialize" "bla"
            in
                ( app, updateMaterialize () )

        ResultAddAutocomplete raceId ->
            let
                resultSet =
                    Set.fromList
                        (List.map
                            (\result -> result.riderId)
                            (List.filter
                                (\result -> result.raceId == raceId)
                                app.results
                            )
                        )

                riders =
                    List.map
                        (\rider -> rider.name)
                        (List.filter
                            (\rider -> not (Set.member rider.id resultSet))
                            app.riders
                        )
            in
                ( app, autocomplete ( "ResultAdd", riders ) )

        SetAutocomplete ( page, value ) ->
            case page of
                "ResultAdd" ->
                    let
                        a =
                            Debug.log "page" page

                        b =
                            Debug.log "value" value
                    in
                        Results.Update.setRider app value

                "AccountLogin" ->
                    Account.Update.loginName app value

                _ ->
                    ( app, Cmd.none )

        {--
            case page of
              "resultAdd" ->
                 ( app, App.Msg.SetResultRiderName value )

              _ ->
            --}
        SetNow maybeDate ->
            ( { app | now = maybeDate }
            , Cmd.none
            )

        SetRaceAdd maybeNow ->
            case app.raceAdd of
                Just currentRaceAdd -> 
                    let
                        dateFormatted =
                            case maybeNow of
                                Just now ->
                                    formatDate now

                                Nothing ->
                                    ""

                        --raceAdd =
                        -- Races.Model.Add "" (Just dateFormatted) Races.Model.Classic
                        raceAdd = { currentRaceAdd | 
                                        dateString = Just dateFormatted }
                    in
                        ( { app | raceAdd = Just raceAdd }
                        , Cmd.none
                        )

                Nothing ->
                    ( app, Cmd.none )

        SetRaceAddYesterday ->
            let
                yesterdayTask =
                    Task.perform
                        --(always (App.Msg.SetRaceAddYesterday2 Nothing))
                        (Just >> App.Msg.SetRaceAddYesterday2)
                        Date.now
            in
                --( app, yesterdayTask )
                ( app, Cmd.batch [ yesterdayTask, updateMaterialize () ] )

        SetRaceAddYesterday2 maybeDate ->
            case app.raceAdd of
                Just raceAdd ->
                    let
                        dateFormatted =
                            case maybeDate of
                                Just date ->
                                    formatDate (Date.Extra.add Date.Extra.Day (-1) date)

                                Nothing ->
                                    ""

                        newRaceAdd =
                            { raceAdd | dateString = Just dateFormatted }
                    in
                        ( { app | raceAdd = Just newRaceAdd }
                        , Cmd.none
                        )

                Nothing ->
                    ( app, Cmd.none )

        SetRaceAddToday ->
            let
                todayTask =
                    Task.perform
                        --(always (App.Msg.SetRaceAddToday2 Nothing))
                        (Just >> App.Msg.SetRaceAddToday2)
                        Date.now
            in
                ( app, Cmd.batch [ todayTask, updateMaterialize () ] )

        SetRaceAddToday2 maybeDate ->
            case app.raceAdd of
                Just raceAdd ->
                    let
                        dateFormatted =
                            case maybeDate of
                                Just date ->
                                    formatDate date

                                Nothing ->
                                    ""

                        newRaceAdd =
                            { raceAdd | dateString = Just dateFormatted }
                    in
                        ( { app | raceAdd = Just newRaceAdd }
                        , Cmd.none
                        )

                Nothing ->
                    ( app, Cmd.none )

        SetState message ->
            let
                resultApp =
                    Json.Decode.decodeString App.Decoder.app message

                { races, riders, comments, results, page } =
                    Maybe.withDefault
                        { races = []
                        , riders = []
                        , comments = []
                        , results = []
                        , page = "home"
                        }
                        (Result.toMaybe resultApp)
            in
                ( { app
                    | races = races
                    , riders = riders
                    , comments = comments
                    , results = results
                  }
                  --, Cmd.none
                , (Navigation.newUrl ("#" ++ page))
                )

        UrlUpdate route ->
            App.UrlUpdate.urlUpdate route app

        NavigateTo route ->
            ( app, Navigation.newUrl <| App.Routing.reverse route )

        AccountLogin ->
            case app.accountLogin of
                Just accountLogin ->
                    let
                        maybeRider =
                            getRiderByName
                                accountLogin.name
                                app.riders
                    in
                        case maybeRider of
                            Just rider ->
                                ( { app | account = maybeRider }
                                , Navigation.newUrl "#home"
                                )

                            Nothing ->
                                ( app, Cmd.none )

                Nothing ->
                    ( app, Cmd.none )

        AccountLoginName name ->
            Account.Update.loginName app name

        AccountLoginPassword password ->
            case app.accountLogin of
                Just accountLogin ->
                    let
                        nextAccountLogin =
                            { accountLogin | password = password }
                    in
                        ( { app | accountLogin = Just nextAccountLogin }
                        , Cmd.none
                        )

                Nothing ->
                    ( app, Cmd.none )

        AccountLoginAutocomplete ->
            let
                riders =
                    List.map (\rider -> rider.name) app.riders
            in
                ( app, autocomplete ( "AccountLogin", riders ) )

        AccountLogout ->
            case app.account of
                Just account ->
                    ( { app | account = Nothing }
                    , Navigation.newUrl "#home"
                    )

                Nothing ->
                    ( app, Cmd.none )

        AccountSignup ->
            case app.accountSignup of
                Just accountSignup ->
                    let
                        newRider =
                            Riders.Model.Rider
                                ((List.length app.riders) + 1)
                                accountSignup.name
                                Riders.Model.Amateurs
                    in
                        ( { app | riders = (newRider :: app.riders) }
                        , Navigation.newUrl ("#account/login/" ++ newRider.name)
                        )

                Nothing ->
                    ( app, Cmd.none )

        AccountSignupName name ->
            case app.accountSignup of
                Just accountSignup ->
                    let
                        nextAccountSignup =
                            { accountSignup | name = name }
                    in
                        ( { app | accountSignup = Just nextAccountSignup }
                        , Cmd.none
                        )

                Nothing ->
                    ( app, Cmd.none )

        AccountLicence licence ->
            case app.account of
                Just account ->
                    let
                        nextAccount =
                            { account | licence = licence }
                    in
                        ( { app
                            | account = Just nextAccount
                            , riders = (updateRiderLicence account.id licence app.riders)
                          }
                        , Cmd.none
                        )

                Nothing ->
                    ( app, Cmd.none )

        KeyDown keyCode ->
            case keyCode of
                13 ->
                    let
                        a =
                            Debug.log "keyCode" "enter"
                    in
                        ( app, Cmd.none )

                _ ->
                    ( app, Cmd.none )

        KeyboardMsg keyMsg ->
          let
            a = Debug.log "keyMsg" keyMsg
            ( keyboardModel, keyboardCmd ) = Keyboard.Extra.update keyMsg app.keyboardModel
            cmd = case ( Keyboard.Extra.isPressed Keyboard.Extra.Enter keyboardModel && app.raceAdd /= Nothing ) of
                True -> 
                    Task.perform identity (Task.succeed RaceAdd)
                False ->
                    Cmd.none
          in
            ( { app | keyboardModel = keyboardModel }
            , cmd
            -- , Cmd.map KeyboardMsg keyboardCmd TODO: check why it looks like its not needed now
            )

        Noop ->
            ( app, Cmd.none )

updateRiderLicence : Int -> Riders.Model.Licence -> List Riders.Model.Rider -> List Riders.Model.Rider
updateRiderLicence riderId licence riders =
    List.map
        (\rider ->
            let
                riderLicence =
                    case rider.id == riderId of
                        True ->
                            licence

                        False ->
                            rider.licence
            in
                { rider | licence = riderLicence }
        )
        riders


getRiderById : Int -> List Riders.Model.Rider -> Maybe Riders.Model.Rider
getRiderById id riders =
    List.head (List.filter (\rider -> rider.id == id) riders)


getRiderByName : String -> List Riders.Model.Rider -> Maybe Riders.Model.Rider
getRiderByName name riders =
    List.head (List.filter (\rider -> rider.name == name) riders)


getRiderIdByIndex : Int -> List Riders.Model.Rider -> Int
getRiderIdByIndex index riders =
    let
        arrayRiders =
            Array.fromList riders

        maybeRider =
            Array.get index arrayRiders
    in
        case maybeRider of
            Nothing ->
                0

            Just rider ->
                rider.id


calcRaceId : List Race -> Int
calcRaceId races =
    (List.length races) + 1


numMonth : Date.Month -> Int
numMonth month =
    case month of
        Date.Jan ->
            1

        Date.Feb ->
            2

        Date.Mar ->
            3

        Date.Apr ->
            4

        Date.May ->
            5

        Date.Jun ->
            6

        Date.Jul ->
            7

        Date.Aug ->
            8

        Date.Sep ->
            9

        Date.Oct ->
            10

        Date.Nov ->
            11

        Date.Dec ->
            12


leadingZero : Int -> String
leadingZero value =
    if value < 10 then
        "0" ++ toString value
    else
        toString value


formatTime : Date.Date -> String
formatTime datetime =
    toString (Date.hour datetime)
        -- TODO: use leadingZero
        ++
            ":"
        ++ toString (Date.minute datetime)


formatDate : Date.Date -> String
formatDate date =
    (leadingZero (Date.day date))
        ++ "-"
        ++ toString (numMonth (Date.month date))
        ++ "-"
        ++ toString (Date.year date)


setRaceAdd : Cmd Msg
setRaceAdd =
    Task.perform
        --(always (App.Msg.SetRaceAdd Nothing))
        (Just >> App.Msg.SetRaceAdd)
        Date.now
