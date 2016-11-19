--port module App.Update exposing (update, updateWithStorage, calcRaceId)


port module App.Update exposing (update, calcRaceId, urlUpdate)

import App.Model exposing (App)
import App.Routing
import App.Msg exposing (Msg(..))
import App.Commands
import Races.Model exposing (Race)
import Riders.Model
import Comments.Model
import Results.Model
import Riders.Update
import Results.Update
import Comments.Update
--import Material
import Navigation
import String
import Debug
import Array
import Set
import Util
import Json.Decode -- exposing ((:=))


--import Json.Encode

import App.Decoder
import Date
import Date.Extra
import Task


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

port autocomplete : List String -> Cmd msg



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
        AddRace ->
            let
                raceAdd =
                    Util.fromJust app.raceAdd

                newRace =
                    Races.Model.Race
                        (calcRaceId app.races)
                        raceAdd.name
                        raceAdd.dateString
                        Races.Model.Cat_B
            in
                ( { app
                    | races = (newRace :: app.races)
                    , raceAdd = Nothing
                  }
                , Navigation.newUrl ("#races/" ++ (toString newRace.id))
                )

        SetRaceName newName ->
            let
                raceAdd =
                    Util.fromJust app.raceAdd


                newRaceAdd =
                    { raceAdd | name = newName }
            in
                ( { app
                    | raceAdd = Just newRaceAdd
                  }
                , Cmd.none
                )

        SetRaceDate newDate ->
            let
                raceAdd =
                    Util.fromJust app.raceAdd

                newRaceAdd =
                    { raceAdd | dateString = newDate }
            in
                ( { app
                    | raceAdd = Just newRaceAdd
                  }
                , Cmd.none
                )

        AddRider rider ->
            Riders.Update.addRider app rider

        SetRiderName newName ->
            Riders.Update.setRiderAddName app newName

        AddResult ->
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

        SetResultAddResult value ->
            --Results.Update.setResultAddResult app value
            let
                resultAdd =
                    Util.fromJust app.resultAdd

                resultAddWithResult =
                    { resultAdd | result = value }
            in
                ( { app | resultAdd = Just resultAddWithResult }
                , Cmd.none
                )

        SetResultRider newId ->
            case String.toInt newId of
                Err msg ->
                    Debug.crash "Value not an int in SetResultRider"

                Ok value ->
                    Results.Update.setResultAddRider app value

        SetResultRiderName name ->
            let
                a = Debug.log "name" name
            in
                Results.Update.setRider app name

        ResultAddSetRiderId index ->
            let
                id =
                    Debug.log "id: " (getRiderIdByIndex index app.riders)
            in
                Results.Update.setResultAddRider app id

        CommentAddSetText text ->
            let
                commentAdd =
                    Util.fromJust app.commentAdd

                --account =
                --    Util.fromJust app.account

                --riderId = account.id
                    
                commentAddWithText =
                    { commentAdd 
                        | text = text
                        --, riderId = riderId
                    }
            in
                ( { app | commentAdd = Just commentAddWithText }
                , Cmd.none
                )

        --Comments.Update.setText app text
        CommentAddSetRiderName riderName ->
            let
                commentAdd =
                    Util.fromJust app.commentAdd

                commentAddWithRiderName =
                    { commentAdd | riderName = riderName }
            in
                ( { app | commentAdd = Just commentAddWithRiderName }
                , Cmd.none
                )

        CommentAdd ->
            let
                ( comment, cmd ) =
                    Comments.Update.new
                        ((List.length app.comments) + 1)
                        app
            in
                ( { app
                    | comments = (Debug.log "comment2" comment) :: app.comments
                    , commentAdd = Nothing
                  }
                , cmd
                )
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

        Autocomplete raceId ->
            let
                resultSet = Set.fromList
                                (List.map 
                                    (\result -> result.riderId)
                                    ( List.filter
                                        (\result -> result.raceId == raceId)
                                        app.results
                                    ) 
                                )

                riders = List.map
                            (\rider -> rider.name)
                            (List.filter
                                (\rider -> not (Set.member rider.id resultSet))
                                app.riders
                            )

            in
                ( app, autocomplete riders )

        SetNow maybeDate ->
            ( { app | now = maybeDate }
            , Cmd.none
            )

        SetRaceAdd maybeNow ->
            let
                dateFormatted =
                    case maybeNow of
                        Just now ->
                            formatDate now

                        Nothing ->
                            ""

                raceAdd =
                    Races.Model.Add "" dateFormatted
            in
                ( { app | raceAdd = Just raceAdd }
                , Cmd.none
                )

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
            let
                raceAdd =
                    Util.fromJust app.raceAdd

                today =
                    Util.fromJust maybeDate

                dateFormatted =
                    case maybeDate of
                        Just date ->
                            formatDate (Date.Extra.add Date.Extra.Day (-1) date)

                        Nothing ->
                            ""

                newRaceAdd =
                    { raceAdd | dateString = dateFormatted }
            in
                ( { app | raceAdd = Just newRaceAdd }
                , Cmd.none
                )

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
            let
                raceAdd =
                    Util.fromJust app.raceAdd

                dateFormatted =
                    case maybeDate of
                        Just date ->
                            formatDate date

                        Nothing ->
                            ""

                newRaceAdd =
                    { raceAdd | dateString = dateFormatted }
            in
                ( { app | raceAdd = Just newRaceAdd }
                , Cmd.none
                )

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
            let 
                bla = Debug.log "bla route" route
            in
                urlUpdate route app

        NavigateTo route ->
            ( app, Navigation.newUrl <| App.Routing.reverse route )

        AccountLogin ->
            let
                maybeRider = getRiderByName 
                                app.accountLogin.name
                                app.riders

            in
                ( { app | account = maybeRider }
                , Navigation.newUrl "#home"
                )

        AccountLoginName name ->
            let 
                previousAccountLogin = app.accountLogin
                accountLogin = { previousAccountLogin | name = name }
            in
                ( { app | accountLogin = accountLogin }
                , Cmd.none
                )

        AccountLoginPassword password ->
            let 
                previousAccountLogin = app.accountLogin
                accountLogin = { previousAccountLogin | password = password }
            in
                ( { app | accountLogin = accountLogin }
                , Cmd.none
                )
            
    
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


formatDate : Date.Date -> String
formatDate date =
    (leadingZero (Date.day date)) ++
    "-" ++
    toString (numMonth (Date.month date)) ++
    "-" ++
    toString (Date.year date)

--urlUpdate : Result String App.Routing.Route -> App -> ( App, Cmd Msg )
urlUpdate : App.Routing.Route -> App -> ( App, Cmd Msg )
urlUpdate route app =
            let
                -- Trying to do some onUrlLeave, to put some state back to Nothing
                newApp = case route of
                            App.Routing.CommentAdd raceId ->
                                { app | route = route }

                            _ ->
                                let
                                    maybeCommentAdd = app.commentAdd
                                in
                                    case maybeCommentAdd of
                                        Just commentAdd ->
                                            { app | commentAdd = Nothing
                                                  , route = route
                                            }

                                        Nothing -> 
                                            { app | route = route }
            in
                case route of
                    App.Routing.ResultsAdd raceId ->
                        --(Results.Update.setResultAddRace newApp raceId)
                        let
                            resultAdd =
                                Results.Model.initialAdd

                            name = case app.account of
                                Just account ->
                                    account.name
                                Nothing ->
                                    ""

                            resultAddWithRaceId =
                                { resultAdd 
                                    | raceId = raceId
                                    , riderName = name
                                }
                        in
                            ( { newApp | resultAdd = Just resultAddWithRaceId }
                            --, Cmd.none
                            , App.Commands.fetchForRoute (App.Routing.ResultsAdd raceId)
                            )

                    App.Routing.CommentAdd raceId ->
                        --Comments.Update.setRaceId newApp raceId
                        let
                            commentAdd =
                                Comments.Model.initialAdd

                            riderName = (Util.fromJust app.account).name

                            commentAddWithRaceId =
                                { commentAdd 
                                    | raceId = raceId
                                    , riderName = riderName
                                }

                            a = Debug.log "urlUpdate CommentAdd" riderName
                            b = Debug.log "urlUpdate CommentAdd" raceId
                        in
                            ( { newApp | commentAdd = Just commentAddWithRaceId }
                            --, Cmd.none
                            , App.Commands.fetchForRoute (App.Routing.CommentAdd raceId)
                            )
    
                    App.Routing.RacesAdd ->
                        --( { newApp | raceAdd = Just raceAdd }
                        let
                            a = Debug.log "urlUpdate" "RacesAdd"
                        in
                            ( newApp, App.Commands.fetchForRoute App.Routing.RacesAdd )
                        {--
                        ( newApp
                          --, Cmd.none
                        , Cmd.batch
                            [ setRaceAdd
                            , Task.perform 
                                --identity 
                                identity 
                                (Task.succeed App.Msg.UpdateMaterialize)
                            ]
                        )
                        --}

                    _ ->
                        newApp
                            ! []


setRaceAdd : Cmd Msg
setRaceAdd =
    Task.perform 
        --(always (App.Msg.SetRaceAdd Nothing)) 
        (Just >> App.Msg.SetRaceAdd) 
        Date.now


