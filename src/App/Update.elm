port module App.Update exposing (update)

import App.Model exposing (App)
import App.Page
import App.Msg exposing (Msg(..))
import Races.Model exposing (Race, RaceAdd)
import Riders.Model exposing (Rider, RiderAdd)
import Comments.Model
import Results.Model
import Riders.Update
import Results.Update
import Comments.Update
import Material
import Navigation
import String
import Debug
import Array
import Json.Decode exposing ((:=))


setRaceName : Race -> String -> Race
setRaceName race name =
    { race | name = name }


setRaceId : Race -> List Race -> Race
setRaceId race races =
    let
        id =
            calcRaceId races
    in
        { race | id = id }


calcRaceId : List Race -> Int
calcRaceId races =
    (List.length races) + 1


clearRaceName : Race -> Race
clearRaceName race =
    setRaceName race ""


setRaceAdd : RaceAdd -> Race -> RaceAdd
setRaceAdd raceAdd race' =
    { raceAdd | race = race' }


port alert : String -> Cmd msg


type alias Car =
    { name : String
    }


type alias Bla =
    { page : String
    , riders : List Riders.Model.Rider
    , races : List Races.Model.Race
    , comments : List Comments.Model.Comment
    , results : List Results.Model.Result
    }


update : Msg -> App -> ( App, Cmd Msg )
update msg app =
    case msg of
        AddRace race ->
            let
                newRace =
                    setRaceId race app.races
            in
                ( { app
                    | races = (List.append [ newRace ] app.races)
                    , raceAdd = (setRaceAdd app.raceAdd (clearRaceName app.raceAdd.race))
                  }
                , Navigation.newUrl ("#races/" ++ (toString newRace.id))
                )

        SetRaceName name' ->
            let
                raceAdd =
                    app.raceAdd

                race =
                    raceAdd.race

                race' =
                    { race | name = name' }

                raceAdd' =
                    { raceAdd | race = race' }

                app' =
                    { app | raceAdd = raceAdd' }
            in
                ( app'
                , Cmd.none
                )

        AddRider rider ->
            Riders.Update.addRider app rider

        SetRiderName newName ->
            Riders.Update.setRiderAddName app newName

        AddResult ->
            Results.Update.addResult app

        SetResultResult value ->
            Results.Update.setResultAddResult app value

        SetResultRider newId ->
            case String.toInt newId of
                Err msg ->
                    Results.Update.setResultAddRider app 0

                Ok value ->
                    Results.Update.setResultAddRider app value

        SetResultRiderName name ->
            Results.Update.setRider app name

        ResultAddSetRiderId index ->
            let
                id =
                    Debug.log "id: " (getRiderIdByIndex index app.riders)
            in
                Results.Update.setResultAddRider app id

        CommentAddSetText text ->
            Comments.Update.setText app text

        CommentAddSetRiderIndex riderIndex ->
            Comments.Update.setRiderIndex app riderIndex

        CommentAdd ->
            Comments.Update.add app

        GoTo page ->
            ( app
            , (Navigation.newUrl (App.Page.toHash page))
            )

        Alert message ->
            ( app
            , alert (Debug.log "alert message" message)
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
            App.Model.initial

        SetState message ->
            let
                pageDecoder : Json.Decode.Decoder String
                pageDecoder =
                    "page" := Json.Decode.string

                --"races" := (Json.Decode.list Json.Decode.int)
                numbers : Json.Decode.Decoder (List Int)
                numbers =
                    Json.Decode.list Json.Decode.int

                maybePage =
                    Json.Decode.decodeString pageDecoder message

                maybeNumbers =
                    Json.Decode.decodeString numbers message

                --y = Debug.log "y" maybeNumbers
                carDecoder : Json.Decode.Decoder Car
                carDecoder =
                    Json.Decode.object1 Car
                        ("name" := Json.Decode.string)

                raceDecoder : Json.Decode.Decoder Races.Model.Race
                raceDecoder =
                    Json.Decode.object2 Races.Model.Race
                        ("id" := Json.Decode.int)
                        ("name" := Json.Decode.string)

                riderDecoder : Json.Decode.Decoder Riders.Model.Rider
                riderDecoder =
                    Json.Decode.object3 Riders.Model.Rider
                        ("id" := Json.Decode.int)
                        ("name" := Json.Decode.string)
                        ("licence" := Json.Decode.string)

                commentDecoder : Json.Decode.Decoder Comments.Model.Comment
                commentDecoder =
                    Json.Decode.object4 Comments.Model.Comment
                        ("id" := Json.Decode.int)
                        ("raceId" := Json.Decode.int)
                        ("riderId" := Json.Decode.int)
                        ("text" := Json.Decode.string)

                resultDecoder : Json.Decode.Decoder Results.Model.Result
                resultDecoder =
                    Json.Decode.object4 Results.Model.Result
                        ("id" := Json.Decode.int)
                        ("riderId" := Json.Decode.int)
                        ("raceId" := Json.Decode.int)
                        ("result" := Json.Decode.string)

                blaDecoder : Json.Decode.Decoder Bla
                blaDecoder =
                    Json.Decode.object5 Bla
                        ("page" := Json.Decode.string)
                        ("riders" := (Json.Decode.list riderDecoder))
                        ("races" := (Json.Decode.list raceDecoder))
                        ("comments" := (Json.Decode.list commentDecoder))
                        ("results" := (Json.Decode.list resultDecoder))

                --appDecoder : Json.Decode.Decoder
                maybeBla =
                    Json.Decode.decodeString blaDecoder message

                --races = z.races
                races =
                    case maybeBla of
                        Ok val ->
                            val.races

                        Err msg ->
                            []

                riders =
                    case maybeBla of
                        Ok val ->
                            val.riders

                        Err msg ->
                            []

                comments =
                    case maybeBla of
                        Ok val ->
                            val.comments

                        Err msg ->
                            Debug.log ("err" ++ msg) []

                results =
                    case maybeBla of
                        Ok val ->
                            val.results

                        Err msg ->
                            Debug.log ("err" ++ msg) []

                page =
                    case maybePage of
                        Ok val ->
                            Debug.log "page" val

                        Err msg ->
                            "home"
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

        Mdl msg' ->
            Material.update msg' app


checkBla : Result a b -> String
checkBla resultBla =
    case resultBla of
        Ok val ->
            let
                x =
                    Debug.log "val" val
            in
                "ok!"

        Err msg ->
            "err!"


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



--DecodePage : Json.Decode.Decoder Json.Decode.String
--DecodePage =
--decode Json.Decode.DecodeString message
